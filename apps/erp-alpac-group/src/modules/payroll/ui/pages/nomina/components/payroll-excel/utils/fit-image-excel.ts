export function fitImageInBox(
  naturalWidth: number,
  naturalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const ratio = naturalWidth / naturalHeight;
  let width = maxWidth;
  let height = maxHeight;
  if (width / height > ratio) {
    width = height * ratio;
  } else {
    height = width / ratio;
  }
  return { width: Math.round(width), height: Math.round(height) };
}

export async function getImageNaturalSize(
  arrayBuffer: ArrayBuffer,
): Promise<{ width: number; height: number }> {
  const blob = new Blob([arrayBuffer]);
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Error al cargar la imagen"));
      image.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}
