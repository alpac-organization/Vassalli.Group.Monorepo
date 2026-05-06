import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export type PdfSignatory = {
  name: string;
  role: string;
};

export type PayrollPdfProps = {
  data: PayrollItemResponse[];
  branchName: string;
  startDate?: string;
  endDate?: string;
  visibleKeys: string[];
  typePayroll: PayrollType;
  preparedBy?: PdfSignatory;
  reviewedBy?: PdfSignatory;
};
