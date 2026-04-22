/**
 * Convierte la cantidad de dias a recibir de la solicitud de vacaciones en un formato legible.
 * 
 * @param raw cantidad de dias a recibir
 * @returns cantidad de dias a recibir en formato legible
 */
export function formatRequestedDays(raw: number) {
   if (!raw) return "—"
   if (!Number.isInteger(raw) && raw < 1) return `${raw} horas`
   return `${raw} ${raw === 1 ? "día" : "días"}`
}