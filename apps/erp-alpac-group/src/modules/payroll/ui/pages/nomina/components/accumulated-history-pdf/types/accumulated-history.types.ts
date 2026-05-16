import type { GetPayrollReportsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PdfSignatory } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";

export type AccumulatedHistoryPdfProps = {
  data: GetPayrollReportsResponse[];
  reviewedBy?: PdfSignatory;
};
