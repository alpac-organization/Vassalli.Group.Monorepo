import dayjs from "dayjs";

/** Convierte Dayjs, Date, ISO string u otro valor a `yyyy-MM-dd` para el API. */
export function toDateOnly(value: unknown): string {
   if (!value) return "";
   const date = dayjs(value as dayjs.ConfigType);
   return date.isValid() ? date.format("YYYY-MM-DD") : "";
}