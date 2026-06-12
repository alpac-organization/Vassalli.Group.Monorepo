import type { EnumType } from "@app/shared/types/enum.type";

export const DeductionPaymentOriginEnum: Record<string, EnumType> = {
  Payroll: { value: 1, label: "Nómina" },
  Manual: { value: 2, label: "Manual" },
  External: { value: 3, label: "Externo" },
} as const;

export type DeductionPaymentOriginEnum =
  (typeof DeductionPaymentOriginEnum)[keyof typeof DeductionPaymentOriginEnum];

export const DeductionPaymentOriginOptions = Object.values(
  DeductionPaymentOriginEnum,
);

export function getDeductionPaymentOriginLabel(origin: string | number): string {
  if (typeof origin === "string") {
    const byKey = DeductionPaymentOriginEnum[origin];
    if (byKey) return byKey.label;
  }

  const numericValue = typeof origin === "number" ? origin : Number(origin);
  if (!Number.isNaN(numericValue)) {
    const byValue = DeductionPaymentOriginOptions.find(
      (item) => item.value === numericValue,
    );
    if (byValue) return byValue.label;
  }

  return typeof origin === "string" ? origin : "Desconocido";
}
