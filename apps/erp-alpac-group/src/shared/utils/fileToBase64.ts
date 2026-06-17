export const fileToBase64 = (
  file: File,
): Promise<{ image_base64: string; content_type: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const content_type = file.type || "image/jpeg";
      const image_base64 = dataUrl.split(",")[1] ?? "";
      resolve({ image_base64, content_type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
