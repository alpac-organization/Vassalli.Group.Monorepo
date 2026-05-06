import type { GetPayrollReportsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
export type AccumulatedHistoryPdfProps = {
  data: GetPayrollReportsResponse[];
};
