import type { EnumType } from "@app/shared/types/enum.type";

export const DeductionStatusEnum: Record<string, EnumType> = {
  Progress: { value: 1, label: "En progreso" },
  Completed: { value: 2, label: "Completado" },
  Cancelled: { value: 3, label: "Cancelado" },
} as const;

export type DeductionStatusEnum =
  (typeof DeductionStatusEnum)[keyof typeof DeductionStatusEnum];

export const DeductionStatusOptions = Object.values(DeductionStatusEnum);

export const DeductionStatusBadgeColorByKey: Record<string, string> = {
  Progress:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export const DeductionStatusBadgeColor: Record<number, string> = {
  1: DeductionStatusBadgeColorByKey.Progress,
  2: DeductionStatusBadgeColorByKey.Completed,
  3: DeductionStatusBadgeColorByKey.Cancelled,
};

export function getDeductionStatusLabel(status: string | number): string {
  if (typeof status === "string") {
    const byKey = DeductionStatusEnum[status];
    if (byKey) return byKey.label;
  }

  const numericValue = typeof status === "number" ? status : Number(status);
  if (!Number.isNaN(numericValue)) {
    const byValue = DeductionStatusOptions.find(
      (item) => item.value === numericValue,
    );
    if (byValue) return byValue.label;
  }

  return "Desconocido";
}

export function getDeductionStatusBadgeColor(status: string | number): string {
  if (typeof status === "string" && DeductionStatusBadgeColorByKey[status]) {
    return DeductionStatusBadgeColorByKey[status];
  }

  const numericValue = typeof status === "number" ? status : Number(status);
  if (!Number.isNaN(numericValue) && DeductionStatusBadgeColor[numericValue]) {
    return DeductionStatusBadgeColor[numericValue];
  }

  return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
}
