import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";

export interface ModalDetailsPayrollProps {
  isOpen: boolean;
  onClose: () => void;
  payrollItem: PayrollItemResponse | null;
  onEditDeductions?: () => void;
}
