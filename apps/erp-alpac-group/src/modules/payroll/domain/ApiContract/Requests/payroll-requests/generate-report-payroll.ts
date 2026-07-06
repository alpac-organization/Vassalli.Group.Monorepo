import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export interface GenerateReportPayrollRequest {
  report_type: ReportPayrollType;
  companie_id: string;
  payroll_id: string;
  payroll_type: PayrollType;
  module_code: string;
  identification_number?: string;
  area_id?: string;
}
export type ReportPayrollType =
  | "Accumulated"
  | "VacationAccrual"
  | "TravelExpenses"
  | "InssFortnightly"
  | "InssMonthly"
  | "IrAndSalaryEarned"
  | "Depreciations"
  | "Subsidies";
