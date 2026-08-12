import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GenerateReportPayrollRequest extends BaseRequest {
  report_type: ReportPayrollType;  
  payroll_id: string;
  payroll_type: PayrollType;  
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
