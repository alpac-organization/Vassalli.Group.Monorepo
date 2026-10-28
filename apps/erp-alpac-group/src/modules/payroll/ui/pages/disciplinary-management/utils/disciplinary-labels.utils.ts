import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";
import { SanctionStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-status.enum";
import { SanctionTypeEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/sanction-type.enum";

const resolveLabel = (
  enumMap: Record<string, { value: number | string; label: string }>,
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "string" && enumMap[value]) {
    return enumMap[value].label;
  }

  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isNaN(numeric)) {
    const match = Object.values(enumMap).find((item) => item.value === numeric);
    if (match) return match.label;
  }

  return String(value);
};

export const getFaultSeverityLabel = (value: string | number | null | undefined) =>
  resolveLabel(FaultSeverityEnum, value);

export const getFaultStatusLabel = (value: string | number | null | undefined) =>
  resolveLabel(FaultStatusEnum, value);

export const getFaultSourceLabel = (value: string | number | null | undefined) =>
  resolveLabel(FaultSourceEnum, value);

export const getSanctionTypeLabel = (value: string | number | null | undefined) =>
  resolveLabel(SanctionTypeEnum, value);

export const getSanctionStatusLabel = (
  value: string | number | null | undefined,
) => resolveLabel(SanctionStatusEnum, value);

export const getFaultStatusBadgeClass = (
  value: string | number | null | undefined,
): string => {
  const key = String(value);
  if (key === "Open" || key === "1") {
    return "bg-amber-100! text-amber-800! dark:bg-amber-900/40! dark:text-amber-200!";
  }
  if (key === "SanctionApplied" || key === "2") {
    return "bg-emerald-100! text-emerald-800! dark:bg-emerald-900/40! dark:text-emerald-200!";
  }
  if (key === "Prescribed" || key === "3") {
    return "bg-slate-100! text-slate-700! dark:bg-slate-700/50! dark:text-slate-300!";
  }
  return "bg-slate-100! text-slate-700! dark:bg-slate-700/50! dark:text-slate-300!";
};

export const getSanctionStatusBadgeClass = (
  value: string | number | null | undefined,
): string => {
  const key = String(value);
  if (key === "Applied" || key === "1") {
    return "bg-emerald-100! text-emerald-800! dark:bg-emerald-900/40! dark:text-emerald-200!";
  }
  if (key === "Cancelled" || key === "2") {
    return "bg-rose-100! text-rose-800! dark:bg-rose-900/40! dark:text-rose-200!";
  }
  return "bg-slate-100! text-slate-700! dark:bg-slate-700/50! dark:text-slate-300!";
};
