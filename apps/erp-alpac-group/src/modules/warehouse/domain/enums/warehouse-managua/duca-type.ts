import type { EnumType } from "@app/shared/types/enum.type";

export const DucaTypeRecord: Record<string, EnumType> = {
  DUCA_F: { value: 1, label: "DUCA F" },
  DUCA_D: { value: 2, label: "DUCA D" },
  DUCA_T: { value: 3, label: "DUCA T" },
};

export const DucaTypeOptions: EnumType[] = Object.values(DucaTypeRecord);

function normalizeTypeKey(value: string): string {
  return value.replace(/[_\s-]/g, "").toLowerCase();
}

type DucaTypeEntry = [string, EnumType];

function findDucaTypeEntry(
  type: string | null | undefined,
): DucaTypeEntry | undefined {
  if (!type) return undefined;

  const normalized = normalizeTypeKey(type);

  return Object.entries(DucaTypeRecord).find(
    ([key, item]) =>
      normalizeTypeKey(key) === normalized ||
      String(item.value) === type.trim(),
  );
}

export function resolveDucaTypeKey(
  type: string | null | undefined,
): string {
  const match = findDucaTypeEntry(type);
  return match ? match[0] : "";
}

export function resolveDucaTypeValue(
  type: string | null | undefined,
): number | undefined {
  const match = findDucaTypeEntry(type);
  return match ? Number(match[1].value) : undefined;
}