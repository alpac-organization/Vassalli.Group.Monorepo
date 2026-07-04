import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";

export function buildDepreciationReportPeriodLabel(
  startDate?: string,
  endDate?: string,
): string | undefined {
  const start = startDate?.trim();
  const end = endDate?.trim();

  if (!start || !end) return undefined;

  return `Fecha de: ${formatDateToSpanishWords(start)} al ${formatDateToSpanishWords(end)}`;
}

export function formatDepreciationAmount(
  amount: number,
  currency: "NIO" | "USD",
): string {
  if (!amount) return "—";
  return formatCurrency(amount, currency);
}
