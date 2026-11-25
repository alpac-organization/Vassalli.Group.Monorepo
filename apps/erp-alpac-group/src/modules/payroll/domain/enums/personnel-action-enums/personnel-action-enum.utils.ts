import type { EnumType } from "@app/shared/types/enum.type";

export function resolveEnumEntry<T extends EnumType>(
  enumMap: Record<string, T>,
  value: string | number | null | undefined,
): T | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const byKey = enumMap[value];
    if (byKey) return byKey;
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (!Number.isNaN(numericValue)) {
    return Object.values(enumMap).find((item) => item.value === numericValue);
  }

  return undefined;
}
