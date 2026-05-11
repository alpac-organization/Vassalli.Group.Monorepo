export type AddDeductionFormProps = {
   onSubmit: (data: any) => void;
   onCancel?: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};


export type Deductions = {
   deduction_type: string;
};