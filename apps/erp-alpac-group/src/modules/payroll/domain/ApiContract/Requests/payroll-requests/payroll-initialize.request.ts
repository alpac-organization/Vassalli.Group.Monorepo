import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export interface InitializePayrollParams {
  companie_id: string;
  module_code: string;
}

export interface InitializePayrollResponse {
  type: PayrollType;
  branch_id: string;
}
