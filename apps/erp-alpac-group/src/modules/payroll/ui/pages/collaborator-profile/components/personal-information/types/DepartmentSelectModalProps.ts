import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdateCollaboratorProfileDetailsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/update-collaborator-request";
export type DepartmentSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  currentDepartmentSubId: number | null;
  identificationNumber: string;
  moduleCode: string;
  updateMutation: UseMutationResult<
    void,
    Error,
    UpdateCollaboratorProfileDetailsRequest,
    unknown
  >;
  onDepartmentSaved: (subCatalogId: number, departmentName: string) => void;
  onSuccessMessage: () => void;
  onErrorMessage: (msg: string) => void;
};
