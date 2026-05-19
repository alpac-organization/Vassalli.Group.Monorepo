import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

export interface CreateIncomeModalProps {
   isOpen: boolean;
   collaborator?: GetCollaboratorProfileDetailsResponse;
   payrollId: string;
   branchId: string;
   onClose: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
}