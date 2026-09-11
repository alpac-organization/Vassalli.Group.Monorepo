export const toDataUrl = (
  image_base64?: string | null,
  content_type?: string | null,
): string | null => {
  const value = image_base64?.trim();
  if (!value) return null;

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  const mimeType =
    content_type?.trim() ||
    (value.startsWith("iVBOR") ? "image/png" : undefined) ||
    (value.startsWith("UklGR") ? "image/webp" : undefined) ||
    (value.startsWith("/9j/") ? "image/jpeg" : undefined) ||
    "image/jpeg";

  return `data:${mimeType};base64,${value.replace(/\s/g, "")}`;
};
