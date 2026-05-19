export type AddDeductionModalProps = {
  isOpen: boolean;
  payrollId: string;
  branchId: string;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  onRequestSuccess?: (message: string) => void;
  onRequestError?: (message?: string) => void;
};
