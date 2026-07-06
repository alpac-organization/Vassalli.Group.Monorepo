import type { GetPayrollReportsDepreciationResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";

export interface DepreciationReportPdfProps {
  data: GetPayrollReportsDepreciationResponse[];
  startDate?: string;
  endDate?: string;
  branchName: string;
}
