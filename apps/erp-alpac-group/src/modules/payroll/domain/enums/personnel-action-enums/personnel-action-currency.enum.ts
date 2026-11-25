import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry } from "./personnel-action-enum.utils";

export type CurrencyEnumType = EnumType & {
  symbol: string;
};

export const PersonnelActionCurrencyEnum = {
  NIO: { value: 1, label: "Córdobas (C$)", symbol: "C$" },
  USD: { value: 2, label: "Dólares (U$)", symbol: "U$" },
} as const satisfies Record<string, CurrencyEnumType>;

export type PersonnelActionCurrencyEnum =
  (typeof PersonnelActionCurrencyEnum)[keyof typeof PersonnelActionCurrencyEnum];

export const PersonnelActionCurrencyOptions: CurrencyEnumType[] = Object.values(
  PersonnelActionCurrencyEnum,
);

export function getCurrencySymbol(
  currency: string | number | null | undefined,
): string {
  if (currency === "U$") return "U$";
  return (
    resolveEnumEntry(PersonnelActionCurrencyEnum, currency)?.symbol ?? "C$"
  );
}

export function resolveCurrencyOptionValue(
  currency: string | number | null | undefined,
): string {
  if (currency === "U$") return "2";
  return (
    resolveEnumEntry(PersonnelActionCurrencyEnum, currency)?.value.toString() ??
    "1"
  );
}

export function formatSalaryAmount(
  amount: number | null | undefined,
  currency: string | number | null | undefined,
): string {
  const safeAmount = amount ?? 0;
  return `${getCurrencySymbol(currency)} ${safeAmount.toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
