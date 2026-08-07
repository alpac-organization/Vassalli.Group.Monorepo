import dayjs, { type Dayjs } from "dayjs";
const DATE_FORMATS = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.SSSZ",
] as const;

export function parseEntryDate(entryDate?: string | null): Dayjs | null {
  const raw = entryDate?.trim();
  if (!raw) return null;

  const strict = dayjs(raw, DATE_FORMATS as unknown as string[], true);
  if (strict.isValid()) return strict.startOf("day");

  const fallback = dayjs(raw);
  return fallback.isValid() ? fallback.startOf("day") : null;
}
