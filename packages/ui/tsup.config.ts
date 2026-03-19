import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  minify: !options.watch,
  assets: ["./src/fonts/**/*", "./src/assets/**/*"],
  bundle: true,
  loader: {
    ".woff2": "file",
    ".woff": "file",
    ".svg": "dataurl",
  },
  ...options,
}));