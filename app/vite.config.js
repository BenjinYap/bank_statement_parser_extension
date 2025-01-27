import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
  ],
  base: '',
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
})
