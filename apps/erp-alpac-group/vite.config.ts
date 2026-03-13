import path from 'node:path'
import react from '@vitejs/plugin-react-swc'

import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Es vital que los alias más específicos vayan PRIMERO
      '@alpac/modules': path.resolve(__dirname, './src/modules'),
      '@alpac/shared': path.resolve(__dirname, './src/shared'),
      '@alpac/routers': path.resolve(__dirname, './src/routers'),
      '@alpac': path.resolve(__dirname, './src')
    }
  },
  server: {
    allowedHosts: [
      "erp-web-08eg.onrender.com",
      "localhost",
      "127.0.0.1"
    ]
  }
})
