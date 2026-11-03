/**
 * Evidencia persistida de una falta o sanción (respuesta de detalle).
 *
 * A diferencia del request, aquí ya no viene `image_base64`:
 * el backend expone la URL pública en S3.
 *
 * @property {string|null} file_name - Nombre original del archivo.
 * @property {string|null} content_type - MIME type almacenado (ej. `image/jpeg`).
 * @property {string|null} image_url - URL pública de la imagen en S3 (`Manager/DisciplinaryFaults` o `Manager/DisciplinarySanctions`).
 *
 * @example
 * ```ts
 * const evidence: DisciplinaryEvidenceResponse = {
 *   file_name: "acta.jpg",
 *   content_type: "image/jpeg",
 *   image_url: "https://bucket.s3.amazonaws.com/Manager/DisciplinarySanctions/XyZ.jpg",
 * };
 * ```
 */
export interface DisciplinaryEvidenceResponse {
  file_name: string | null;
  content_type: string | null;
  image_url: string | null;
}
