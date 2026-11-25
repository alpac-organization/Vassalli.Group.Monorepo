import {
  CurrencyEnum,
  type CurrencyCode,
} from "@app/core/enums/currency.enum";
import { resolveEnumEntry } from "@app/shared/utils/enum.utils";

export const formatCurrency = (
  value: number,
  currency = "NIO",
  minimumFractionDigits = 2,
) => {
  const numAmount =
    typeof value === "string" ? Number.parseFloat(value) : value;

  return new Intl.NumberFormat(currency === "NIO" ? "es-NI" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(numAmount);
};

type CurrencySource = string | number | null | undefined;

export function resolveCurrencyCode(currency: CurrencySource): CurrencyCode {
  if (currency === "U$") return "USD";
  return resolveEnumEntry(CurrencyEnum, currency) === CurrencyEnum.USD
    ? "USD"
    : "NIO";
}

export function resolveCurrencyOptionValue(currency: CurrencySource): string {
  return CurrencyEnum[resolveCurrencyCode(currency)].value.toString();
}
