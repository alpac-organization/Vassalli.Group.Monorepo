import { MaritalStatus } from "@app/core/enums/marital-status.enum";

export type MaritalStatusSource = string | number | null | undefined;

const maritalEntries = Object.entries(MaritalStatus) as [
  keyof typeof MaritalStatus,
  (typeof MaritalStatus)[keyof typeof MaritalStatus],
][];

/**
 * Resuelve el texto mostrable del estado civil desde:
 * - clave API (`"Separated"`), con o sin variación de mayúsculas
 * - id numérico (`6` o `"6"`), alineado con `<select>` del formulario
 * - etiqueta ya en español (`"Separado"`), p. ej. tras mapear el perfil
 */
export function maritalRawToLabel(raw: MaritalStatusSource): string | null {
  if (raw === null || raw === undefined) return null;

  const s = String(raw).trim();
  if (s === "") return null;

  const byExactKey = MaritalStatus[s as keyof typeof MaritalStatus];
  if (byExactKey && typeof byExactKey === "object" && "label" in byExactKey) {
    console.log(byExactKey.label);
    return byExactKey.label;
  }

  const byLabel = Object.values(MaritalStatus).find((m) => m.label === s);
  return byLabel?.label ?? null;
}
