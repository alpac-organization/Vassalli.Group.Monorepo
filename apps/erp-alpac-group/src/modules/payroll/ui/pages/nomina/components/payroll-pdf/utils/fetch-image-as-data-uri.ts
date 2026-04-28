/**
 * Descarga una imagen por URL y la convierte a data URI para @react-pdf/renderer.
 * Evita fallos de CORS del fetch interno de <Image src={url remota} />.
 */
export async function fetchImageAsDataUri(
  url: string | undefined | null,
): Promise<string | undefined> {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;

  try {
    const response = await fetch(trimmed, {
      mode: "cors",
      credentials: "omit",
    });
    if (!response.ok) return undefined;

    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        resolve(typeof result === "string" ? result : "");
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(blob);
    }).then((dataUri) => (dataUri.length > 0 ? dataUri : undefined));
  } catch {
    return undefined;
  }
}
