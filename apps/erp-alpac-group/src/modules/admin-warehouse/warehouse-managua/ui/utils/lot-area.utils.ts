/**
 * Utilidades de formato para la vista de tramos.
 * Recuperadas del antiguo warehouse-utils del modulo warehouse eliminado en develop.
 */
export function formatAreaM2(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${value} m²`;
}

export function getOccupancyBarColor(percentage: number): string {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}
