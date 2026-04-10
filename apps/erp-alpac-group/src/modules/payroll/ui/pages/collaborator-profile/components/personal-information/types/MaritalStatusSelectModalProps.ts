export interface MaritalStatusSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaritalStatus: number;
  isSaving: boolean;
  onConfirm: (status: number) => Promise<void>;
}
