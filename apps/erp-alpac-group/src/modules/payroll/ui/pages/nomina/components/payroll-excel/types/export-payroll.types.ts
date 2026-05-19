import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export type ExportPayrollExcelParams = {
  data: PayrollItemResponse[];
  visibleKeys: string[];
  companyName?: string | null;
  branchName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  typePayroll?: PayrollType | null;
  logoUrl?: string | null;
};
