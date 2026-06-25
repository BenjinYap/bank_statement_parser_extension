import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
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
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./src/tests/setup.ts'],
  },
})
