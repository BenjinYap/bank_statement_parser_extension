import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import { receiptServer } from './vite/receiptServer'

const CONFIG_DIRECTORY = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    svelte(),
    tailwindcss(),
    receiptServer(loadEnv(mode, CONFIG_DIRECTORY, 'NGROK_').NGROK_DOMAIN),
  ],
  base: '',
  resolve: {
    conditions: process.env.VITEST ? ['browser'] : undefined,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/script.js',
        chunkFileNames: 'assets/script.js',
        assetFileNames: (asset) => {
          const names = (asset.names ?? []).filter((name) => {
            return /\.css$/.test(name ?? '');
          });

          if (names.length > 0) {
            return 'assets/[name].css'; // Static name for CSS files
          }

          return 'assets/[name][extname]'; // Handle other assets
        }
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['./tests/setup.ts'],
  },
}))
