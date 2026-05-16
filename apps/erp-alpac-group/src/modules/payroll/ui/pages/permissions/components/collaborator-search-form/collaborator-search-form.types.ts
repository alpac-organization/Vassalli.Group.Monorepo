import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export interface CollaboratorSearchFormProps {
   onSuccess: (collaborator: GetCollaboratorProfileDetailsResponse) => void;
   onError: (errorMessage: string) => void;
   onSearchStart: () => void;
   excludeIdentifications?: string[];
   label?: string;
}
