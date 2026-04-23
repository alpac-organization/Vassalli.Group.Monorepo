import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";

export type WorkInformationProps = {
  profile?: GetCollaboratorProfileDetailsResponse;
};

export interface BranchOption {
  value: string;
  label: string;
}

export interface BranchSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBranchId: string | null;
  options: BranchOption[];
  isSaving: boolean;
  onConfirm: (branchId: string, branchName: string) => Promise<void>;
}
