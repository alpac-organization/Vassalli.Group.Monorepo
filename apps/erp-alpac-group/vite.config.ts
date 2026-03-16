import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@alpac/modules': path.resolve(__dirname, './src/modules'),
      '@alpac/shared': path.resolve(__dirname, './src/shared'),
      '@alpac/routers': path.resolve(__dirname, './src/routers'),
      '@alpac': path.resolve(__dirname, './src'),
    },
  },
});