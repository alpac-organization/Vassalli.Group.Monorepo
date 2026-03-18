import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  minify: !options.watch,
  assets: ["./src/fonts/**/*"],
  bundle: true,
  loader: {
    ".woff2": "file",
    ".woff": "file",
  },
  ...options,
}));