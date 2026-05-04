import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";

export interface PayrollPeriodItem {
  payrollId: string;
  startDate: string;
  endDate: string;
  type: PayrollType;
  branchId?: string;
  branchName?: string;
}

export interface GetPayrollPeriodsHistoryResponse {
  items: PayrollPeriodItem[];
  total_items: number;
  page_size: number;
  page_number: number;
}
