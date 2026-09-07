import { TimeTypeEnum } from "@app/core/enums/time-type.enum";
export function formatTimeTypeLabel(type: string | null): string {
  if (!type?.trim()) return "—";
  const match = Object.values(TimeTypeEnum).find(
    (option) => option.stringValue.toLowerCase() === type.trim().toLowerCase(),
  );
  return match?.label ?? type;
}
