import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PdfSignatory } from "@app/modules/payroll/ui/pages/nomina/types/payroll.types";

export type PayrollPdfProps = {
  data: PayrollItemResponse[];
  branchName: string;
  companyName?: string | null;
  startDate?: string;
  endDate?: string;
  visibleKeys: string[];
  typePayroll: PayrollType;
  preparedBy?: PdfSignatory;
  reviewedBy?: PdfSignatory;
};
