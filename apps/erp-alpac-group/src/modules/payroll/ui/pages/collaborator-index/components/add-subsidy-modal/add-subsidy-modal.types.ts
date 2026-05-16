import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export type AddSubsidyModalProps = {
   isOpen: boolean;
   collaborator?: GetCollaboratorProfileDetailsResponse;
   onClose: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};