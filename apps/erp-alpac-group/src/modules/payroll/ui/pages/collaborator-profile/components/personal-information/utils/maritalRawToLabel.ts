import { MaritalStatus } from "@app/core/enums/marital-status.enum";
import { normalizeMaritalStatusFromApi } from "./normalizeMaritalStatusFromApi";

export type MaritalStatusSource = string | number | null | undefined;

/**
 * Resuelve el texto mostrable del estado civil desde:
 * - id numérico (`6` o `"6"`)
 * - clave API / enum (`"Separated"`, `DomesticPartner`, etc.)
 * - etiqueta en español (`"Separado"`)
 */
export function maritalRawToLabel(raw: MaritalStatusSource): string | null {
  if (raw === null || raw === "") return null;

  const code = normalizeMaritalStatusFromApi(raw);
  if (code !== "") {
    console.log("code", code);
    const n = Number(code);
    const hit = Object.values(MaritalStatus).find((m) => m.value === n);
    return hit?.label ?? null;
  }

  const byExactKey = MaritalStatus[raw as keyof typeof MaritalStatus];
  if (byExactKey && typeof byExactKey === "object" && "label" in byExactKey) {
    return byExactKey.label;
  }

  const byLabel = Object.values(MaritalStatus).find((m) => m.label === raw);
  return byLabel?.label ?? null;
}
