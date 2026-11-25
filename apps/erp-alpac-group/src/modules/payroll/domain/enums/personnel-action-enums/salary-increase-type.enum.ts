import type { EnumType } from "@app/shared/types/enum.type";
import { resolveEnumEntry } from "@app/shared/utils/enum.utils";

export const SalaryIncreaseTypeEnum = {
  None: { value: 0, label: "Sin Aumento Salarial" },
  FixedAmount: { value: 1, label: "Monto Fijo" },
  Percentage: { value: 2, label: "Porcentual (%)" },
  AnnualMinimumWage: { value: 3, label: "Salario Mínimo Anual (%)" },
} as const satisfies Record<string, EnumType>;

export type SalaryIncreaseTypeEnum =
  (typeof SalaryIncreaseTypeEnum)[keyof typeof SalaryIncreaseTypeEnum];

export const SalaryIncreaseTypeOptions: EnumType[] = Object.values(
  SalaryIncreaseTypeEnum,
);

export const SalaryIncreaseTypeBadgeColor: Record<number, string> = {
  0: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  1: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  2: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  3: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
};

export function resolveSalaryIncreaseTypeNumber(
  increaseType: string | number | null | undefined,
): number {
  return resolveEnumEntry(SalaryIncreaseTypeEnum, increaseType)?.value ?? 0;
}

export function getSalaryIncreaseTypeLabel(
  increaseType: string | number | null | undefined,
): string {
  return (
    resolveEnumEntry(SalaryIncreaseTypeEnum, increaseType)?.label ??
    "Sin Aumento Salarial"
  );
}

export function getSalaryIncreaseTypeBadgeColor(
  increaseType: string | number | null | undefined,
): string {
  const num = resolveSalaryIncreaseTypeNumber(increaseType);
  return SalaryIncreaseTypeBadgeColor[num] ?? SalaryIncreaseTypeBadgeColor[0];
}

export function formatIncreaseValueDisplay(
  increaseType: string | number | null | undefined,
  increaseValue: number | null | undefined,
): string | null {
  const typeNum = resolveSalaryIncreaseTypeNumber(increaseType);
  if (typeNum === 0 || increaseValue === null || increaseValue === undefined) {
    return null;
  }
  const formatted = increaseValue.toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return typeNum === 1 ? `+${formatted}` : `+${formatted}%`;
}
