import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";

export const PAYROLL_ACTIONS_WITH_EXCEL: readonly PayrollActionValue[] = [
  "report",
  "vacation_accrual_area_report",
  "accumulated_history",
  "income_report",
  "deduction_report",
  "consolidated_area_report",
  "employee_receivables_report",
  "vacation_permissions_summary_report",
  "monthly_accumulated_report",
  "monthly_ir_report",
  "monthly_inss_report",
] as const;

export const actionSupportsExcel = (action: PayrollActionValue): boolean =>
  PAYROLL_ACTIONS_WITH_EXCEL.includes(action);
