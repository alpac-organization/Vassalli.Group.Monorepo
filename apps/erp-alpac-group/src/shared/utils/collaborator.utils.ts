const COLLABORATOR_CODE_SEGMENT_LENGTHS = [3, 3, 2, 4] as const;
const COLLABORATOR_CODE_MAX_LENGTH = 12;
const COLLABORATOR_CODE_PATTERN = /^[A-Z]{3}-[A-Z]{3}-\d{2}-\d{4}$/;

/**
 * Normaliza el código del colaborador a 12 caracteres alfanuméricos sin guiones.
 * Segmentos: 3 letras + 3 letras + 2 dígitos + 4 dígitos.
 */
function normalizeCollaboratorCodeRaw(code: string): string {
   if (!code) return "";

   const chars = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().split("");
   const result: string[] = [];

   for (const char of chars) {
      const pos = result.length;
      if (pos >= COLLABORATOR_CODE_MAX_LENGTH) break;

      const isLetterSlot = pos < 6;
      if (isLetterSlot && /[A-Z]/.test(char)) {
         result.push(char);
      } else if (!isLetterSlot && /\d/.test(char)) {
         result.push(char);
      }
   }

   return result.join("");
}

/**
 * Formatea el código del colaborador al patrón XXX-XXX-XX-XXXX.
 * @example ALP-MGA-09-0001
 */
export const formatCollaboratorCode = (code: string): string => {

   const raw = normalizeCollaboratorCodeRaw(code);
   
   if (!raw) return "";

   const segments: string[] = [];
   let offset = 0;

   for (const length of COLLABORATOR_CODE_SEGMENT_LENGTHS) {
      const segment = raw.slice(offset, offset + length);
      if (!segment) break;

      segments.push(segment);
      offset += length;

      if (offset >= raw.length) break;
   }

   return segments.join("-");
};

export const validateCollaboratorCode = (code: string): boolean | string => {
   if (!code) return true;

   return (
      COLLABORATOR_CODE_PATTERN.test(code) ||
      "El código de colaborador debe tener el formato XXX-XXX-XX-XXXX (ej: ALP-MGA-09-0001)"
   );
};
