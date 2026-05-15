import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export type CreateIncomeFormProps = {
   collaborator: GetCollaboratorProfileDetailsResponse;
   payrollId: string;
   onCancel: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};

export interface IncomeTypeOption {
   id: string;
   code: string;
   label: string;
}