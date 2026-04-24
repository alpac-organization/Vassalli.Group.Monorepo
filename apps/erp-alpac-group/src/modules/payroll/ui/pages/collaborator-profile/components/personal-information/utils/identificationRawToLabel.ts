import { IdentificationEnum } from "@app/core/enums/identification.enum";

/** Mapea id numérico, clave del enum o texto del API al label de `IdentificationEnum`. */
export function identificationRawToLabel(raw: string | null): string | null {
  if (raw === null || raw === "") return null;
  const s = String(raw).trim();

  const key = s.toUpperCase() as keyof typeof IdentificationEnum;
  const byKey = IdentificationEnum[key];
  if (byKey) return byKey.label;

  return s;
}
