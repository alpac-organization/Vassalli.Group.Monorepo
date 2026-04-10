import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateCollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/update-collaborator-request";
export type MaritalStatusSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  currentMaritalStatus: number;
  identificationNumber: string;
  moduleCode: string;
  updateMutation: UseMutationResult<
    void,
    Error,
    UpdateCollaboratorProfileDetailsRequest,
    unknown
  >;
  onMaritalSaved: (maritalStatus: number) => void;
  onSuccessMessage: () => void;
  onErrorMessage: (msg: string) => void;
};
