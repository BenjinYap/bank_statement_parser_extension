import { readFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin, ViteDevServer } from 'vite';

const PAGE_PATH = '/receipt';
const PHOTO_PATH = '/receipt/photo';
const PAGE_FILE = new URL('./receiptPage.html', import.meta.url);
// The phone page shrinks each photo to far below this limit before upload.
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

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
export function receiptServer():Plugin {
  let photo:Buffer|undefined;

  async function storePhoto(request:IncomingMessage, response:ServerResponse) {
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
    response.setHeader('Cache-Control', 'no-store');
    if (photo === undefined) {
      response.statusCode = 204;
      response.end();
      return;
    }

    response.setHeader('Content-Type', 'image/jpeg');
    response.end(photo);
    photo = undefined;
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

    next();
  }

  return {
    name: 'receipt-server',
    configureServer(server:ViteDevServer) {
      server.middlewares.use((request, response, next) => {
        handleRequest(request, response, next).catch(next);
      });
    },
  };
}
