import dayjs from "dayjs";

/** Normaliza ISO u otro valor de fecha a `yyyy-MM-dd` para inputs `type="date"`. */
export function formatIsoString(value: string | null): string {
  if (!value || typeof value !== "string") return "";
  return value.substring(0, 10);
}

/** Convierte Dayjs, Date, ISO string u otro valor a `yyyy-MM-dd` para el API. */
export function toDateOnly(value: unknown): string {
  if (!value) return "";
  const date = dayjs(value as dayjs.ConfigType);
  return date.isValid() ? date.format("YYYY-MM-DD") : "";
}