import type { GetPayrollReportsAccumulatedResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PdfSignatory } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";

export type AccumulatedHistoryPdfProps = {
  data: GetPayrollReportsAccumulatedResponse[];
  reviewedBy?: PdfSignatory;
  reviewedSignatureImageSrc?: string;
  startDate?: string;
  endDate?: string;
};
