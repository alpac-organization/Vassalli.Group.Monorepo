/**
 * Formatea una fecha ISO a un formato legible para el user
 */

export function formatVacationDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  const dateOnly = isoDate.split("T")[0];
  const d = new Date(`${dateOnly}T12:00:00`);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
