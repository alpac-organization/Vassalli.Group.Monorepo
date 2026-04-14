/**
 * Formatea el código del colaborador
 * @param code Código del colaborador
 * @returns Código del colaborador formateado
 */
export const formatCollaboratorCode = (code: string): string => {

   if (!code) return "";

   const raw = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 7);

   if (raw.length <= 3) return raw;

   return `${raw.slice(0, 3)}-${raw.slice(3, 7)}`
}
