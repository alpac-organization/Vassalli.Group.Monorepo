/** Normaliza ISO u otro valor de fecha a `yyyy-MM-dd` para inputs `type="date"`. */
export function formatIsoString(value: string | null): string {
  if (!value || typeof value !== "string") return "";
  return value.substring(0, 10);
}
