import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
export type StoredPayrollSelection = {
  type: PayrollType;
  branch_id: string;
};

export type PdfSignatory = {
  name: string;
  role?: string;
};
