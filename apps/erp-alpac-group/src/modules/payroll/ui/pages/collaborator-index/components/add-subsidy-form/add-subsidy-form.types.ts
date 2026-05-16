import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export type AddSubsidyFormProps = {
   collaborator: GetCollaboratorProfileDetailsResponse;
   onCancel: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};