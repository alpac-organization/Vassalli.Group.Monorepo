import type { PayrollType } from "@app/modules/payroll/domain/ApiContract/Requests/payroll-requests/payroll-process.request";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export interface ModalDetailsPayrollProps {
  isOpen: boolean;
  onClose: () => void;
  payrollItem: PayrollItemResponse | null;
  payrollId?: string;
  payrollType?: PayrollType;
  onEditDeductions?: () => void;
}
