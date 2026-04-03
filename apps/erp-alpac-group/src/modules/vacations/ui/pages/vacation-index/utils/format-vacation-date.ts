/**
 *
 * @param isoDate - Fecha en formato ISO (YYYY-MM-DD)
 * @returns Fecha formateada, ejemplo: "4 may 2024"
 */
export function formatVacationDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
