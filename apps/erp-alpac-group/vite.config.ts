import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
// 1. Importamos el plugin de polyfills
import { nodePolyfills } from "vite-plugin-node-polyfills";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      include: ["buffer"],
      globals: {
        Buffer: true,
      },
    }),
  ],
  server: {
    proxy: {
      "/api-payroll": {
        target: "https://erp-core-manager-api.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-payroll/, "/api/v1"),
      },
      "/api-warehouse": {
        target: "",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-warehouse/, "/api/v1"),
      },
    },
  },
  resolve: {
    alias: {
      "@app/modules": path.resolve(__dirname, "./src/modules"),
      "@app/shared": path.resolve(__dirname, "./src/shared"),
      "@app/routers": path.resolve(__dirname, "./src/routers"),
      "@app/assets": path.resolve(__dirname, "./src/assets"),
      "@app": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    css: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. Agrupar todo el ecosistema de React junto para evitar ciclos internos
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router/") ||
              id.includes("/scheduler/")
            ) {
              return "vendor-core";
            }

            // 2. Agrupar librerías pesadas o específicas
            if (id.includes("@tanstack")) return "vendor-query";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("lucide-react")) return "vendor-ui";

            // 3. Agrupar utilidades comunes
            if (id.includes("axios") || id.includes("zustand")) {
              return "vendor-utils";
            }
          }
        },
      },
    },
  },
});
