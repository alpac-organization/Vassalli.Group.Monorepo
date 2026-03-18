import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@app/modules': path.resolve(__dirname, './src/modules'),
      '@app/shared': path.resolve(__dirname, './src/shared'),
      '@app/routers': path.resolve(__dirname, './src/routers'),
      '@app': path.resolve(__dirname, './src'),
    },
  },
});