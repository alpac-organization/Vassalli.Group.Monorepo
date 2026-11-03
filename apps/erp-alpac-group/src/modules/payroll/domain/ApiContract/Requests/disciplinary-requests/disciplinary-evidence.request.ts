/**
 * Evidencia de imagen enviada al registrar una falta o sanción.
 *
 * El backend recibe el contenido en base64, lo sube a S3 y persiste
 * solo metadatos + URL (no guarda el base64 en BD).
 *
 * Content types permitidos: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`.
 *
 * @property {string} file_name - Nombre del archivo (con extensión acorde al content type).
 * @property {string} content_type - MIME type de la imagen (ej. `image/jpeg`).
 * @property {string} image_base64 - Contenido de la imagen codificado en base64 (sin prefijo `data:`).
 *
 * @example
 * ```ts
 * const evidence: DisciplinaryEvidenceRequest = {
 *   file_name: "acta.jpg",
 *   content_type: "image/jpeg",
 *   image_base64: "/9j/4AAQSkZJRgABAQAAAQABAAD...",
 * };
 * ```
 */
export interface DisciplinaryEvidenceRequest {
  file_name: string;
  content_type: string;
  image_base64: string;
}
