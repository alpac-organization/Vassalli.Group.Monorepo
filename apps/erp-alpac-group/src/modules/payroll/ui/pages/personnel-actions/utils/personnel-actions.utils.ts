import { resolveSalaryIncreaseTypeNumber } from "@app/modules/payroll/domain/enums/personnel-action-enums/salary-increase-type.enum";

/**
 * Calculates the projected salary applying the selected increase rule.
 * Mirrors backend CalculatorUtils.CalculateNewSalary with 2-decimal rounding.
 */
export function calculateProjectedSalary(
  currentSalary: number | null | undefined,
  increaseType: string | number,
  increaseValue: number | null | undefined,
): number | null {
  if (!currentSalary || currentSalary <= 0) return null;
  const typeNum = resolveSalaryIncreaseTypeNumber(increaseType);
  if (typeNum === 0) return null;
  if (!increaseValue || increaseValue <= 0 || Number.isNaN(increaseValue)) {
    return null;
  }

  if (typeNum === 1) {
    return Math.round((currentSalary + increaseValue) * 100) / 100;
  }

  if (typeNum === 2 || typeNum === 3) {
    const increment = Math.round(currentSalary * (increaseValue / 100) * 100) / 100;
    return Math.round((currentSalary + increment) * 100) / 100;
  }

  return null;
}
