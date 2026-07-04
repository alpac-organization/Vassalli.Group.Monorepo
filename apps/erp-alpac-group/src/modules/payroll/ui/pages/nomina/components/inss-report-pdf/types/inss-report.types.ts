import type { GetPayrollReportsInssInformationResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";

export interface InssReportPdfProps {
  data: GetPayrollReportsInssInformationResponse[];
  startDate?: string;
  endDate?: string;
  branchName: string;
  isFortnightly: boolean;
}
