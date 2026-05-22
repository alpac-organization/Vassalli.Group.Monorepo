import type { GetPayrollReportsVacationAccrualResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll-reports";
import type { PdfSignatory } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";

export type VacationAccrualPdfProps = {
  data: GetPayrollReportsVacationAccrualResponse[];
  reviewedBy?: PdfSignatory;
  reviewedSignatureImageSrc?: string;
  startDate?: string;
  endDate?: string;
};
