import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry } from "@app/shared/utils/enum.utils";

export const PersonnelActionStatusEnum = {
  PendingApproval: { value: 1, label: "Pendiente de Aprobación" },
  Approved: { value: 2, label: "Aprobada" },
  Rejected: { value: 3, label: "Rechazada" },
  Applied: { value: 4, label: "Aplicada" },
} as const satisfies Record<string, EnumType>;

export type PersonnelActionStatusEnum =
  (typeof PersonnelActionStatusEnum)[keyof typeof PersonnelActionStatusEnum];

export const PersonnelActionStatusOptions: EnumType[] = Object.values(
  PersonnelActionStatusEnum,
);

export const PersonnelActionStatusBadgeColor: Record<number, string> = {
  1: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  2: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  3: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  4: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export function getPersonnelActionStatusLabel(status: string | number): string {
  return resolveEnumEntry(PersonnelActionStatusEnum, status)?.label ?? "Desconocido";
}

export function getPersonnelActionStatusBadgeColor(status: string | number): string {
  const entry = resolveEnumEntry(PersonnelActionStatusEnum, status);
  return (
    (entry && PersonnelActionStatusBadgeColor[entry.value]) ??
    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
  );
}

export function isPersonnelActionPending(status: string | number): boolean {
  return resolveEnumEntry(PersonnelActionStatusEnum, status)?.value === 1;
}

export function isPersonnelActionApproved(status: string | number): boolean {
  return resolveEnumEntry(PersonnelActionStatusEnum, status)?.value === 2;
}

export function isPersonnelActionApplied(status: string | number): boolean {
  return resolveEnumEntry(PersonnelActionStatusEnum, status)?.value === 4;
}
