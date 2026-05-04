import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export interface PayrollPeriodsHistoryRequest {
  companie_id: string;
  module_code: string;
  type: PayrollType;
  branch_id: string;
  page_number?: number;
  page_size?: number;
}
