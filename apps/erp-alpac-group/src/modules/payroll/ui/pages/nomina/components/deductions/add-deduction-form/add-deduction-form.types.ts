import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";

export type AddDeductionFormProps = {
   onSubmit?: (data: CreateDeductionRequest) => void;
   onCancel?: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};