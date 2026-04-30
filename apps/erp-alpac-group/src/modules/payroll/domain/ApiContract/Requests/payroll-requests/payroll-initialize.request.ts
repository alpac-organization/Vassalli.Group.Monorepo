import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export interface InitializePayrollParams {
  companie_id: string;
  module_code: string;
  type: PayrollType;
  branch_id: string;
}

export interface InitializePayrollResponse {
  companie_id: string;
  module_code: string;
  type: PayrollType;
  branch_id: string;
}
