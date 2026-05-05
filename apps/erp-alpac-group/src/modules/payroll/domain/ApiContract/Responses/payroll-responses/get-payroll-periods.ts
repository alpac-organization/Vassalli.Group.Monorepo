import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

export interface PayrollPeriodItem {
  payroll_id: string;
  start_date: string;
  end_date: string;
  type: PayrollType;
  branch_id?: string;
  branch_name?: string;
}

export interface GetPayrollPeriodsHistoryResponse {
  items: PayrollPeriodItem[];
  total_items: number;
  page_size: number;
  page_number: number;
}
