/**
 * Descarga una imagen por URL y la convierte a data URI para @react-pdf/renderer.
 */
// export async function fetchImageAsDataUri(
//   url: string | undefined | null,
// ): Promise<string | undefined> {
//   const trimmed = url?.trim();
//   if (!trimmed) return undefined;

//   try {
//     const response = await fetch(trimmed, {
//       mode: "cors",
//       credentials: "omit",
//     });

//     if (!response.ok) {
//       console.warn(`Error HTTP al descargar imagen: ${response.status}`);
//       return undefined;
//     }

//     const blob = await response.blob();

//     return await new Promise<string>((resolve, reject) => {
//       const reader = new FileReader();

//       reader.onloadend = () => {
//         const result = reader.result;
//         resolve(typeof result === "string" ? result : "");
//       };

//       reader.onerror = () =>
//         reject(new Error("Error leyendo el archivo de imagen (FileReader)"));

//       reader.readAsDataURL(blob);
//     }).then((dataUri) => (dataUri.length > 0 ? dataUri : undefined));
//   } catch (error) {
//     console.error(
//       "Error de red o CORS al intentar descargar la imagen:",
//       error,
//     );
//     return undefined;
//   }
// }

export async function fetchImageAsDataUri(
  url: string | undefined | null,
): Promise<string | undefined> {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(proxyUrl);
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
