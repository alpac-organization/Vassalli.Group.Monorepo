export interface BankOption {
  value: string;
  label: string;
}

export interface BankSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBankId: string | null;
  options: BankOption[];
  isSaving: boolean;
  onConfirm: (bankId: string, bankName: string) => Promise<void>;
}
