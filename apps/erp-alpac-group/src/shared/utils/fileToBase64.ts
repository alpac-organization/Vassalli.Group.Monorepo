const toJpegFileName = (fileName: string): string => {
  const baseName = fileName.replace(/\.[^/.]+$/, "") || "image";
  return `${baseName}.jpg`;
};

type FileInformation = {
  image_base64: string;
  content_type: string;
  file_name: string;
};

export const fileToBase64 = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.5,
): Promise<FileInformation> => {
  return new Promise((resolve, reject) => {
    // PDFs y otros no-imagen: sin reencodeo; nombre y tipo originales.
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const image_base64 = dataUrl.split(",")[1] ?? "";
        resolve({
          image_base64,
          content_type: file.type,
          file_name: file.name,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        // Imágenes: siempre JPEG + nombre .jpg
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const image_base64 = dataUrl.split(",")[1] ?? "";

        resolve({
          image_base64,
          content_type: "image/jpeg",
          file_name: toJpegFileName(file.name),
        });
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
