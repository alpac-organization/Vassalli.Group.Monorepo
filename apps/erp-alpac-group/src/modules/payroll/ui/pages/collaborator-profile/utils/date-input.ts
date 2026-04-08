/** Normaliza ISO u otro valor de fecha a `yyyy-MM-dd` para inputs `type="date"`. */
export function toHtmlDateInputValue(
  value: string | Date | null | undefined,
): string {
  if (value == null || value === "") return "";
  if (value instanceof Date)
    return Number.isNaN(value.getTime())
      ? ""
      : value.toISOString().slice(0, 10);
  const s = String(value).trim();
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
