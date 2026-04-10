export interface DepartmentSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  currentDepartmentSubId: number | null;
  isSaving: boolean;
  onConfirm: (subId: number, departmentName: string) => Promise<void>;
}
