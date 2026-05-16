import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

const selectablePayrollTypes = new Set<PayrollType>([
  "Ordinary",
  "Provided",
  "ProfessionalServices",
]);
export function isSelectablePayrollType(value: unknown): value is PayrollType {
  return selectablePayrollTypes.has(value as PayrollType);
}
