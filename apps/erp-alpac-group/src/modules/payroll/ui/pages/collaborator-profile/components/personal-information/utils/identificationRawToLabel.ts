import { IdentificationEnum } from "@app/core/enums/identifcation.enum";

/** Mapea id numérico, clave del enum o texto del API al label de `IdentificationEnum`. */
export function identificationRawToLabel(
  raw: string | number | undefined | null,
): string {
  if (raw === undefined || raw === null) return "";
  const s = String(raw).trim();
  if (s === "") return "";

  const key = s.toUpperCase() as keyof typeof IdentificationEnum;
  const byKey = IdentificationEnum[key];
  if (byKey) return byKey.label;

  const n = Number(s);
  if (!Number.isNaN(n)) {
    const entry = Object.values(IdentificationEnum).find(
      (e) => e.value === n,
    );
    if (entry) return entry.label;
  }

  return s;
}
