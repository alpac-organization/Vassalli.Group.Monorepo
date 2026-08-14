/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.glb?url" {
  const src: string;
  export default src;
}
