function inferIconMimeType(url: string): string | undefined {
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  if (path.endsWith(".svg")) return "image/svg+xml";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".ico")) return "image/x-icon";
  if (path.endsWith(".webp")) return "image/webp";
  return undefined;
}

export function setDocumentFavicon(imageUrl: string, cacheKey?: string): void {
  const href =
    cacheKey !== undefined && cacheKey !== ""
      ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}faviconKey=${encodeURIComponent(cacheKey)}`
      : imageUrl;

  const mime = inferIconMimeType(href);

  const selector =
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]';

  document.querySelectorAll<HTMLLinkElement>(selector).forEach((link) => {
    link.href = href;
    if (mime) link.type = mime;
    else link.removeAttribute("type");
  });
}
