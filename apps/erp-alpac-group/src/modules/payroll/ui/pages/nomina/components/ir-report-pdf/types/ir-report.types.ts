import type { GetIrAndSalaryEarnedResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";

export type IrReportPdfProps = {
  data: GetIrAndSalaryEarnedResponse[];
  startDate?: string;
  endDate?: string;
  branchName?: string;
  isFortnightly: boolean;
};

export type ExportIrReportExcelParams = IrReportPdfProps & {
  logoUrl?: string | null;
};
