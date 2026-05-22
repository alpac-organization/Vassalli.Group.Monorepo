import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export type AddSubsidyFormProps = {
   payrollId: string,
   collaborator: GetCollaboratorProfileDetailsResponse;
   onCancel: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};

export interface SubsidyTypeOption {
   id: string;
   value: string;
   label: string;
}