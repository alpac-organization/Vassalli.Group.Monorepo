import type { DatePickerValue } from "@alpac/design-system";
import dayjs from "dayjs";

export function toDayjs(value: DatePickerValue | null) {
  if (!value) return null;
  return dayjs((value as { $d?: Date }).$d ?? value).startOf("day");
}
export function isStartAfterEnd(
  start: DatePickerValue | null,
  end: DatePickerValue | null,
) {
  const startDay = toDayjs(start);
  const endDay = toDayjs(end);
  if (!startDay || !endDay) return false;
  return startDay.isAfter(endDay);
}
