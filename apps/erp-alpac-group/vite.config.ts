import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { builtinModules } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from "node:fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    {
      name: 'copy-index-to-server',
      closeBundle() {
        if (isSsrBuild) {
          const src = path.resolve(__dirname, 'index.html');
          const dest = path.resolve(__dirname, 'dist/server/index.html');
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log('✅ index.html copiado a dist/server/');
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@alpac/modules': path.resolve(__dirname, './src/modules'),
      '@alpac/shared':  path.resolve(__dirname, './src/shared'),
      '@alpac/routers': path.resolve(__dirname, './src/routers'),
      '@alpac':         path.resolve(__dirname, './src'),
    },
    
  },
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist/client',
    ssr: isSsrBuild,
    rollupOptions: {
      input: isSsrBuild 
        ? { 
            'server':       path.resolve(__dirname, './server.js'),
            'entry-server': path.resolve(__dirname, './src/platform/EntryServer.tsx') 
          }
        : path.resolve(__dirname, './index.html'),
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
      },
      external: [
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
        'fsevents' 
      ],
    },
  },
}));