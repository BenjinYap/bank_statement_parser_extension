import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/main.js',
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
})
