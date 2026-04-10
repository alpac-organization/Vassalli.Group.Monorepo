import { CurrencyEnum } from "@app/core/enums/currency.enum";

type CurrencySource = string | number | null;

/**
 *Encuentra el objeto { value, label } de currencyEnum */
function getCurrencyObj(raw: CurrencySource) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim().toUpperCase();
  for (const [key, obj] of Object.entries(CurrencyEnum)) {
    if (key === s || obj.label.toUpperCase() === s) {
      return obj;
    }
  }

  return null;
}

/** * PARA LA UI: aqui se Transforma lo que viene de la API "NIO" al texto visual "Córdobas"
 */
export function currencyRawToLabel(raw: CurrencySource): string {
  const match = getCurrencyObj(raw);
  return match ? match.label : String(raw ?? "");
}

// export function currencyLabelToApiCode(label: string): number | undefined {
//   const match = getCurrencyObj(label);
//   return match ? match.value : undefined;
// }
