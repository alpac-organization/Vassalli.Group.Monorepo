import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

export interface PayrollCloseRouteParams {
  companie_id: string;
  module_code: string;
  payroll_id: string;
}

export interface PayrollCloseBody {
  branch_id: string;
  payroll_type: PayrollType;
}

export interface PayrollCloseRequest
  extends PayrollCloseRouteParams, PayrollCloseBody {}
