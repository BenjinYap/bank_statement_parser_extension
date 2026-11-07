import { spawn, type ChildProcess } from 'node:child_process';
import { createInterface } from 'node:readline';
import type { Logger } from 'vite';

// Vite imports this module again when the config file changes. The running process is kept on
// globalThis, so that a config change does not start a second ngrok process for the same domain.
const PROCESS_KEY = '__receiptNgrokProcess';

type GlobalWithNgrok = typeof globalThis & { [PROCESS_KEY]?:ChildProcess };

// Starts an ngrok tunnel from the static domain to the dev server port, and logs the phone page URL.
// ngrok stops when the dev server process exits.
export function startNgrok(domain:string, port:number, logger:Logger) {
  const globalObject:GlobalWithNgrok = globalThis;
  if (globalObject[PROCESS_KEY] !== undefined) {
    return;
  }

  const command:string[] = [
    'http', String(port),
    '--url', `https://${domain}`,
    '--log', 'stdout', '--log-format', 'logfmt',
  ];
  const child:ChildProcess = spawn('ngrok', command, { stdio: ['ignore', 'pipe', 'pipe'] });
  globalObject[PROCESS_KEY] = child;

  child.on('error', (error:NodeJS.ErrnoException) => {
    globalObject[PROCESS_KEY] = undefined;
    if (error.code === 'ENOENT') {
      logger.error('ngrok is not installed, so the phone page is only available on this computer.');
      return;
    }

    logger.error(`ngrok did not start: ${error.message}`);
  });

  child.on('exit', (code:number|null) => {
    globalObject[PROCESS_KEY] = undefined;
    if (code !== null && code !== 0) {
      logger.error(`ngrok stopped with exit code ${code}. To see the error, run: ngrok ${command.join(' ')}`);
    }
  });

  // stdout and stderr are not null, because the spawn options set them to 'pipe'.
  createInterface({ input: child.stdout! }).on('line', (line:string) => {
    if (line.includes('msg="started tunnel"')) {
      // The spaces and the arrow match the format of the URL lines that Vite prints at start.
      logger.info(`  ➜  Phone:   https://${domain}/receipt`);
    } else if (line.includes('lvl=eror') || line.includes('lvl=crit')) {
      // The ngrok logfmt output spells the error level "eror".
      logger.error(`ngrok: ${line}`);
    }
  });

  createInterface({ input: child.stderr! }).on('line', (line:string) => {
    logger.error(`ngrok: ${line}`);
  });

  process.on('exit', () => {
    child.kill();
  });
}
