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

export const validateCollaboratorCode = (code: string): boolean | string => {
   if (!code) return true;

   const regex = /^[A-Z0-9]{3}-[A-Z0-9]{4}$/;

   return regex.test(code) || "El código de colaborador debe tener el formato XXX-XXXX";
}
