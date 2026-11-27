import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry, resolveEnumValue } from "@app/shared/utils/enum.utils";

export const DeductionStatusEnum: Record<string, EnumType> = {
  Progress: { value: 1, label: "En progreso" },
  Completed: { value: 2, label: "Completado" },
  Pending: { value: 3, label: "Pendiente" },
  Canceled: { value: 4, label: "Cancelado" },
} as const;

export type DeductionStatusEnum =
  (typeof DeductionStatusEnum)[keyof typeof DeductionStatusEnum];

export const DeductionStatusOptions = Object.values(DeductionStatusEnum);

export const DeductionStatusBadgeColorByKey: Record<string, string> = {
  Progress:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Pending:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Canceled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export const DeductionStatusBadgeColor: Record<number, string> = {
  1: DeductionStatusBadgeColorByKey.Progress,
  2: DeductionStatusBadgeColorByKey.Completed,
  3: DeductionStatusBadgeColorByKey.Pending,
  4: DeductionStatusBadgeColorByKey.Canceled,
};

export function getDeductionStatusLabel(status: string | number): string {
  if (status === "Cancelled") return "Cancelado";
  return resolveEnumEntry(DeductionStatusEnum, status)?.label ?? "Desconocido";
}

export function getDeductionStatusBadgeColor(status: string | number): string {
  return resolveEnumValue(
    status,
    DeductionStatusBadgeColorByKey,
    DeductionStatusBadgeColor,
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  );
}
