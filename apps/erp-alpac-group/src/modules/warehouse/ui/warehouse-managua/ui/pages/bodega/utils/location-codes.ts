import type { LocationCode } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/bodega/types/warehouse-3d.types";
export function rackLevelCodes(
  baseCode: LocationCode,
): readonly [LocationCode, LocationCode, LocationCode] {
  return [baseCode, `${baseCode}-01`, `${baseCode}-02`] as const;
}

export function isRackUpperLevel(code: LocationCode): boolean {
  return /-\d{2}$/.test(code);
}

export function parseRackBase(code: LocationCode): LocationCode {
  const match = code.match(/^(T-\d+)(?:-\d{2})?$/);
  return match?.[1] ?? code;
}

export function rackLevelIndex(code: LocationCode): 0 | 1 | 2 {
  if (code.endsWith("-01")) return 1;
  if (code.endsWith("-02")) return 2;
  return 0;
}
