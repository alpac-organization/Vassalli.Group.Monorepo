/**
 *  Devuelve el conteo de días inclusivos entre dos cadenas de fecha ISO (YYYY-MM-DD).
 * Ambas fechas se interpretan a medianoche UTC para evitar desfases por zona horaria.
 * Retorna 0 si alguna cadena falta o si la fecha final es anterior a la inicial.
 */
export function countInclusiveCalendarDays(
   startDate: string | undefined,
   endDate: string | undefined,
): number {
   if (!startDate || !endDate) return 0;
   const start = Date.UTC(
      Number(startDate.slice(0, 4)),
      Number(startDate.slice(5, 7)) - 1,
      Number(startDate.slice(8, 10)),
   );
   const end = Date.UTC(
      Number(endDate.slice(0, 4)),
      Number(endDate.slice(5, 7)) - 1,
      Number(endDate.slice(8, 10)),
   );
   if (end < start) return 0;
   return Math.round((end - start) / 86_400_000) + 1;
}
