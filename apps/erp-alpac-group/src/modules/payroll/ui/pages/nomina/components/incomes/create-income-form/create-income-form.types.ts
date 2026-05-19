
export type CreateIncomeFormProps = {
   payrollId: string;
   branchId: string;
   onCancel: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};

export interface IncomeTypeOption {
   id: string;
   code: string;
   label: string;
}