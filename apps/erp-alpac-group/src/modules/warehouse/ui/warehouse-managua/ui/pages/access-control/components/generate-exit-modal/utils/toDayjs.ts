import dayjs, { type Dayjs } from "dayjs";
export function toDayjsValue(value: unknown): Dayjs | null {
  if (value == null) return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;

  if (value instanceof Date) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  if (typeof value === "object" && "$d" in value) {
    const nativeDate = (value as { $d?: Date }).$d;
    if (!(nativeDate instanceof Date)) return null;
    const parsed = dayjs(nativeDate);
    return parsed.isValid() ? parsed : null;
  }

  return null;
}
