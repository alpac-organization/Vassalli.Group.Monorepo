import type { GetPayrollReportsVacationAccrualResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export type VacationAccrualAreaRow = {
  payrollItem: PayrollItemResponse;
  accrual: GetPayrollReportsVacationAccrualResponse | null;
  work_area: string;
};

export type VacationAccrualAreaPdfProps = {
  rows: VacationAccrualAreaRow[];
  branchName: string;
  startDate?: string;
  endDate?: string;
};

export type ExportVacationAccrualAreaExcelParams = {
  rows: VacationAccrualAreaRow[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  logoUrl?: string | null;
};
