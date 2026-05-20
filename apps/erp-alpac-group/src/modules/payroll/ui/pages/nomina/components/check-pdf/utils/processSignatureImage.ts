const LIGHT_PIXEL_THRESHOLD = 210;
const ALPHA_CUTOFF = 24;

function isBackgroundPixel(
  r: number,
  g: number,
  b: number,
  a: number,
): boolean {
  if (a < ALPHA_CUTOFF) return true;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return (
    luminance >= LIGHT_PIXEL_THRESHOLD &&
    Math.max(r, g, b) - Math.min(r, g, b) < 35
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la firma"));
    image.src = src;
  });
}

export async function processSignatureImage(src: string): Promise<string> {
  if (!src?.trim()) return "";

  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return src;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      if (isBackgroundPixel(r, g, b, data[index + 3])) {
        data[index + 3] = 0;
        continue;
      }

      data[index + 3] = 255;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (minX > maxX || minY > maxY) return src;

  context.putImageData(imageData, 0, 0);

  const padding = 4;
  const cropX = Math.max(0, minX - padding);
  const cropY = Math.max(0, minY - padding);
  const cropWidth = Math.min(width - cropX, maxX - minX + 1 + padding * 2);
  const cropHeight = Math.min(height - cropY, maxY - minY + 1 + padding * 2);

  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;
  const croppedContext = croppedCanvas.getContext("2d");
  if (!croppedContext) return src;

  croppedContext.drawImage(
    canvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  return croppedCanvas.toDataURL("image/png");
}

const processedCache = new Map<string, Promise<string>>();

export function getProcessedSignatureImage(src: string): Promise<string> {
  if (!src?.trim()) return Promise.resolve("");
  const cached = processedCache.get(src);
  if (cached) return cached;

  const promise = processSignatureImage(src).catch(() => src);
  processedCache.set(src, promise);
  return promise;
}
