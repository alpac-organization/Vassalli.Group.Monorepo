import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry } from "@app/shared/utils/enum.utils";

export const DeductionPaymentOriginEnum: Record<string, EnumType> = {
  Payroll: { value: 1, label: "Nómina" },
  Cash: { value: 2, label: "Efectivo / Manual" },
  ChristmasBonus: { value: 3, label: "Aguinaldo" },
  Liquidation: { value: 4, label: "Liquidación" },
} as const;

export type DeductionPaymentOriginEnum =
  (typeof DeductionPaymentOriginEnum)[keyof typeof DeductionPaymentOriginEnum];

export const DeductionPaymentOriginOptions = Object.values(
  DeductionPaymentOriginEnum,
);

export function getDeductionPaymentOriginLabel(origin: string | number): string {
  if (origin === "Manual") return "Efectivo / Manual";
  const entry = resolveEnumEntry(DeductionPaymentOriginEnum, origin);
  if (entry) return entry.label;
  return typeof origin === "string" && origin.trim() ? origin : "Desconocido";
}
