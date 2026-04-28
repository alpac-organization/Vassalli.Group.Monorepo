export type DeductionType = "Otras deducciones" | "Uniformes";

export type FortnightSelection = "Quincena actual" | "Quincena siguiente";

export interface AddDeductionRequestBase {
  type?: DeductionType;
  fortnight_type?: FortnightSelection;
  fortnight_quantity?: number;
  description: string;
}

export interface AddDeductionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  collaboratorFullName?: string;
  collaboratorWorkPosition?: string;
  isCollaboratorFullNameLoading?: boolean;
  isCollaboratorWorkPositionLoading?: boolean;
  onRequestSuccess?: () => void;
  onRequestError?: (description: string) => void;
}

export interface AddDeductionFormProps {
  isPending: boolean;
  onSubmit: (payload: AddDeductionRequestBase) => void;
  onCancel: () => void;
  companyId: string;
  moduleCode: string;
  identificationNumber: string;
}

export interface DeductionFormValues {
  type?: DeductionType;
  fortnight_type?: FortnightSelection;
  fortnight_quantity?: number;
  description: string;
}
