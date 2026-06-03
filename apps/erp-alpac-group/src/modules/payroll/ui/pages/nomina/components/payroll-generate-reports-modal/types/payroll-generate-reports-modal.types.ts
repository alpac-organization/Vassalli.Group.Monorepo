import type { PayrollActionValue } from "@app/modules/payroll/ui/pages/nomina/types/payroll-actions.types";

export type PayrollGenerateReportsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  options: { label: string; value: PayrollActionValue }[];
  appearance: "dark" | "default";
  selectedAction: PayrollActionValue | null;
  onSelectedActionChange: (value: PayrollActionValue | null) => void;
  generatePdfChecked: boolean;
  generateExcelChecked: boolean;
  onGeneratePdfChange: (checked: boolean) => void;
  onGenerateExcelChange: (checked: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isConfirmLoading?: boolean;
  confirmDisabled?: boolean;
};
