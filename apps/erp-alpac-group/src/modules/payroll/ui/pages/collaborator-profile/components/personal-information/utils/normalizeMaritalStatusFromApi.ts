import { MaritalStatus } from "@app/core/enums/marital-status.enum";

export const MARITAL_STATUS_MIN = 0;
export const MARITAL_STATUS_MAX = 7;

const normKey = (x: string) => x.toLowerCase().replace(/_/g, "");

/**
 * Convierte lo que venga del API (número, string numérico, clave enum, etiqueta) al código 0–7 como string.
 */
export function normalizeMaritalStatusFromApi(
  raw: string | number | null | undefined,
): string {
  if (raw === null || raw === undefined) return "";
  const s = String(raw).trim();
  if (s === "") return "";

  const n = Number(s);
  if (
    Number.isInteger(n) &&
    n >= MARITAL_STATUS_MIN &&
    n <= MARITAL_STATUS_MAX
  ) {
    return String(n);
  }

  const byLabel = Object.values(MaritalStatus).find((m) => m.label === s);
  if (byLabel) return String(byLabel.value);

  for (const [key, val] of Object.entries(MaritalStatus)) {
    if (typeof val === "object" && "value" in val && normKey(key) === normKey(s)) {
      return String(val.value);
    }
  }

  return "";
}

export function isValidMaritalStatusCode(n: number): boolean {
  return (
    Number.isInteger(n) &&
    n >= MARITAL_STATUS_MIN &&
    n <= MARITAL_STATUS_MAX
  );
}
