import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export type CheckPdfProps = {
  data: PayrollItemResponse[];
  startDate?: string;
  endDate?: string;
  branchName?: string;
  signatureImageSrc?: string;
  //   logoSrc?: string;
};
