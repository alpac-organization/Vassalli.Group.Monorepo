import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry, resolveEnumValue } from "@app/shared/utils/enum.utils";

export const DeductionPaymentStatusEnum: Record<string, EnumType> = {
  Paid: { value: 1, label: "Pagado" },
  Pending: { value: 2, label: "Pendiente" },
  Held: { value: 3, label: "Cheque Retenido" },
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
  Held: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export const DeductionPaymentStatusBadgeColor: Record<number, string> = {
  1: DeductionPaymentStatusBadgeColorByKey.Paid,
  2: DeductionPaymentStatusBadgeColorByKey.Pending,
  3: DeductionPaymentStatusBadgeColorByKey.Held,
};

export function getDeductionPaymentStatusLabel(status: string | number): string {
  const entry = resolveEnumEntry(DeductionPaymentStatusEnum, status);
  if (entry) return entry.label;
  return typeof status === "string" && status.trim() ? status : "Desconocido";
}

export function getDeductionPaymentStatusBadgeColor(
  status: string | number,
): string {
  return resolveEnumValue(
    status,
    DeductionPaymentStatusBadgeColorByKey,
    DeductionPaymentStatusBadgeColor,
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  );
}
