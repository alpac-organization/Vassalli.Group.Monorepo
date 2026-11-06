import type { EnumType } from "@app/shared/types/enum.type";

export type AbsenceStatusEnumMap = "Pending" | "Applied" | "Cancelled";

export const AbsenceStatusEnum: Record<AbsenceStatusEnumMap, EnumType> = {
  Pending: { value: 1, label: "Pendiente" },
  Applied: { value: 2, label: "Aplicada" },
  Cancelled: { value: 3, label: "Cancelada" },
} as const;

export type AbsenceStatusEnum =
  (typeof AbsenceStatusEnum)[keyof typeof AbsenceStatusEnum];

export const AbsenceStatusOptions = Object.values(AbsenceStatusEnum);

export const AbsenceStatusBadgeColorByKey: Record<string, string> = {
  Pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200",
  Applied:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-200",
  Cancelled:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200 border-rose-200",
};

export const AbsenceStatusBadgeColor: Record<number, string> = {
  [AbsenceStatusEnum.Pending.value]: AbsenceStatusBadgeColorByKey.Pending,
  [AbsenceStatusEnum.Applied.value]: AbsenceStatusBadgeColorByKey.Applied,
  [AbsenceStatusEnum.Cancelled.value]: AbsenceStatusBadgeColorByKey.Cancelled,
};

export function getAbsenceStatusLabel(status: string | number): string {
  if (typeof status === "string") {
    const byKey = AbsenceStatusEnum[status as AbsenceStatusEnumMap];
    if (byKey) return byKey.label;
  }

  const numericValue = typeof status === "number" ? status : Number(status);
  if (!Number.isNaN(numericValue)) {
    const byValue = AbsenceStatusOptions.find(
      (item) => item.value === numericValue,
    );
    if (byValue) return byValue.label;
  }

  return "Desconocido";
}

export function getAbsenceStatusBadgeColor(status: string | number): string {
  if (typeof status === "string" && AbsenceStatusBadgeColorByKey[status]) {
    return AbsenceStatusBadgeColorByKey[status];
  }

  const numericValue = typeof status === "number" ? status : Number(status);
  if (!Number.isNaN(numericValue) && AbsenceStatusBadgeColor[numericValue]) {
    return AbsenceStatusBadgeColor[numericValue];
  }

  return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
}

export type AbsenceSourceEnumMap = "Manual" | "BiometricClock";

export const AbsenceSourceEnum: Record<AbsenceSourceEnumMap, EnumType> = {
  Manual: { value: 1, label: "Manual" },
  BiometricClock: { value: 2, label: "Reloj Biométrico" },
} as const;

export type AbsenceSourceEnum =
  (typeof AbsenceSourceEnum)[keyof typeof AbsenceSourceEnum];

export const AbsenceSourceOptions = Object.values(AbsenceSourceEnum);

export const AbsenceSourceBadgeColorByKey: Record<string, string> = {
  Manual:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200",
  BiometricClock:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200",
};

export const AbsenceSourceBadgeColor: Record<number, string> = {
  [AbsenceSourceEnum.Manual.value]: AbsenceSourceBadgeColorByKey.Manual,
  [AbsenceSourceEnum.BiometricClock.value]:
    AbsenceSourceBadgeColorByKey.BiometricClock,
};

export function getAbsenceSourceLabel(source: string | number): string {
  if (typeof source === "string") {
    const byKey = AbsenceSourceEnum[source as AbsenceSourceEnumMap];
    if (byKey) return byKey.label;
  }

  const numericValue = typeof source === "number" ? source : Number(source);
  if (!Number.isNaN(numericValue)) {
    const byValue = AbsenceSourceOptions.find(
      (item) => item.value === numericValue,
    );
    if (byValue) return byValue.label;
  }

  return "Desconocido";
}

export function getAbsenceSourceBadgeColor(source: string | number): string {
  if (typeof source === "string" && AbsenceSourceBadgeColorByKey[source]) {
    return AbsenceSourceBadgeColorByKey[source];
  }

  const numericValue = typeof source === "number" ? source : Number(source);
  if (!Number.isNaN(numericValue) && AbsenceSourceBadgeColor[numericValue]) {
    return AbsenceSourceBadgeColor[numericValue];
  }

  return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
}
