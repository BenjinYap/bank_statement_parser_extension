import { readFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Connect, Plugin, ViteDevServer } from 'vite';
import { startNgrok } from './ngrok';

const PAGE_PATH = '/receipt';
const PHOTO_PATH = '/receipt/photo';
const STATUS_PATH = '/receipt/status';
const PAGE_FILE = new URL('./receiptPage.html', import.meta.url);
// The phone page shrinks each photo to far below this limit before upload.
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
// The receipt window polls each second. If no poll arrived in this time, the window is closed.
const POLL_TIMEOUT_MS = 3000;

// Reads the request body. Returns undefined if the body is larger than MAX_PHOTO_BYTES.
// A body that is too large is still read to the end, so the client gets the error response.
function readBody(request:IncomingMessage):Promise<Buffer|undefined> {
  return new Promise((resolve, reject) => {
    const chunks:Buffer[] = [];
    let size:number = 0;
    request.on('data', (chunk:Buffer) => {
      size += chunk.length;
      if (size > MAX_PHOTO_BYTES) {
        return;
      }

      chunks.push(chunk);
    });
    request.on('end', () => {
      if (size > MAX_PHOTO_BYTES) {
        resolve(undefined);
        return;
      }

      resolve(Buffer.concat(chunks));
    });
    request.on('error', reject);
  });
}

// Adds the phone upload page and the photo endpoints to the dev server.
// The server holds one photo in memory and deletes it when the extension fetches it.
// The server accepts a photo only while the receipt window polls for one.
// If ngrokDomain is set, the plugin also starts an ngrok tunnel to the dev server, so that the phone can open the page.
export function receiptServer(ngrokDomain:string|undefined):Plugin {
  let photo:Buffer|undefined;
  let lastPollTime:number = 0;

  function isWindowPolling():boolean {
    return Date.now() - lastPollTime < POLL_TIMEOUT_MS;
  }

  async function storePhoto(request:IncomingMessage, response:ServerResponse) {
    if (!isWindowPolling()) {
      // Discard the unread body, so that the phone gets the error response.
      request.resume();
      response.statusCode = 409;
      response.end('The receipt window is not open. Open Scan Receipt in the extension first.');
      return;
    }

    const contentType:string = request.headers['content-type'] ?? '';
    if (!contentType.startsWith('image/')) {
      response.statusCode = 415;
      response.end('The upload must be an image.');
      return;
    }

    const body:Buffer|undefined = await readBody(request);
    if (body === undefined) {
      response.statusCode = 413;
      response.end(`The photo is larger than ${MAX_PHOTO_BYTES / 1024 / 1024} MB.`);
      return;
    }

    photo = body;
    response.statusCode = 204;
    response.end();
  }

  function sendPhoto(response:ServerResponse) {
    // A photo from before a gap in the polls belongs to a receipt window that is now closed.
    if (!isWindowPolling()) {
      photo = undefined;
    }

    lastPollTime = Date.now();
    response.setHeader('Cache-Control', 'no-store');
    if (photo === undefined) {
      response.statusCode = 204;
      response.end();
      return;
    }

    response.setHeader('Content-Type', 'image/jpeg');
    response.end(photo);
    photo = undefined;
    // The window stops polling after it gets a photo, so block more uploads now. The next poll allows uploads again.
    lastPollTime = 0;
  }

  function sendStatus(response:ServerResponse) {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ ready: isWindowPolling() }));
  }

  async function handleRequest(request:IncomingMessage, response:ServerResponse, next:Connect.NextFunction) {
    const path:string = (request.url ?? '').split('?')[0];
    if (request.method === 'GET' && path === PAGE_PATH) {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(readFileSync(PAGE_FILE));
      return;
    }

    if (request.method === 'POST' && path === PHOTO_PATH) {
      await storePhoto(request, response);
      return;
    }

    if (request.method === 'GET' && path === PHOTO_PATH) {
      sendPhoto(response);
      return;
    }

    if (request.method === 'GET' && path === STATUS_PATH) {
      sendStatus(response);
      return;
    }

    next();
  }

  return {
    name: 'receipt-server',
    configureServer(server:ViteDevServer) {
      server.middlewares.use((request, response, next) => {
        handleRequest(request, response, next).catch(next);
      });

      // Vitest also starts a Vite server. The tests do not need the tunnel.
      if (process.env.VITEST) {
        return;
      }

      if (!ngrokDomain) {
        server.config.logger.warn('NGROK_DOMAIN is not set in app/.env.local, so ngrok does not start.');
        return;
      }

      // In middleware mode, Vite has no HTTP server, so there is no port for the tunnel.
      const httpServer:ViteDevServer['httpServer'] = server.httpServer;
      if (httpServer === null) {
        return;
      }

      // Vite can use a different port when 5173 is busy, so read the port after the server starts listening.
      httpServer.once('listening', () => {
        const address:AddressInfo = httpServer.address() as AddressInfo;
        startNgrok(ngrokDomain, address.port, server.config.logger);
      });
    },
  };
}
