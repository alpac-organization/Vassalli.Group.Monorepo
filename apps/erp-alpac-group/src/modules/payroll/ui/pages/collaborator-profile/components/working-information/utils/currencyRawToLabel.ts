import { CurrencyEnum } from "@app/core/enums/currency.enum";

/** Mapea valor del API (código, id numérico o texto) al label de `CurrencyEnum`. */
export function currencyRawToLabel(
  raw: string | number | undefined | null,
): string {
  if (raw === undefined || raw === null) return "";
  const s = String(raw).trim();
  if (s === "") return "";

  const byKey = CurrencyEnum[s.toUpperCase() as keyof typeof CurrencyEnum];
  if (byKey) return byKey.label;

  const n = Number(s);
  if (!Number.isNaN(n)) {
    const entry = Object.values(CurrencyEnum).find((e) => e.value === n);
    if (entry) return entry.label;
  }

  return s;
}
