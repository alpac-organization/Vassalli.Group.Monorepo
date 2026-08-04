export const isMobileViewport = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 639px)").matches;
