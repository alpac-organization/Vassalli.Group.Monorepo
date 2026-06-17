export const toDataUrl = (
  image_base64?: string | null,
  content_type?: string | null,
): string | null => {
  if (!image_base64) return null;
  if (image_base64.startsWith("data:")) return image_base64;
  return `data:${content_type ?? "image/jpeg"};base64,${image_base64}`;
};
