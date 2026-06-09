import type { EnumType } from "@app/shared/types/enum.type";

export const DeductionPaymentStatusEnum: Record<string, EnumType> = {
  Paid: { value: 1, label: "Pagado" },
  Pending: { value: 2, label: "Pendiente" },
  Cancelled: { value: 3, label: "Cancelado" },
} as const;

export type DeductionPaymentStatusEnum =
  (typeof DeductionPaymentStatusEnum)[keyof typeof DeductionPaymentStatusEnum];

export const DeductionPaymentStatusOptions = Object.values(
  DeductionPaymentStatusEnum,
);

export const DeductionPaymentStatusBadgeColorByKey: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export const DeductionPaymentStatusBadgeColor: Record<number, string> = {
  1: DeductionPaymentStatusBadgeColorByKey.Paid,
  2: DeductionPaymentStatusBadgeColorByKey.Pending,
  3: DeductionPaymentStatusBadgeColorByKey.Cancelled,
};

export function getDeductionPaymentStatusLabel(status: string | number): string {
  if (typeof status === "string") {
    const byKey = DeductionPaymentStatusEnum[status];
    if (byKey) return byKey.label;
  }

  const numericValue = typeof status === "number" ? status : Number(status);
  if (!Number.isNaN(numericValue)) {
    const byValue = DeductionPaymentStatusOptions.find(
      (item) => item.value === numericValue,
    );
    if (byValue) return byValue.label;
  }

  return typeof status === "string" ? status : "Desconocido";
}

export function getDeductionPaymentStatusBadgeColor(
  status: string | number,
): string {
  if (typeof status === "string" && DeductionPaymentStatusBadgeColorByKey[status]) {
    return DeductionPaymentStatusBadgeColorByKey[status];
  }

  const numericValue = typeof status === "number" ? status : Number(status);
  if (!Number.isNaN(numericValue) && DeductionPaymentStatusBadgeColor[numericValue]) {
    return DeductionPaymentStatusBadgeColor[numericValue];
  }

  return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
}
