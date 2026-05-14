import type { CreateDeductionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export type AddDeductionFormProps = {
   collaborator: GetCollaboratorProfileDetailsResponse;
   onSubmit?: (data: CreateDeductionRequest) => void;
   onCancel?: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};