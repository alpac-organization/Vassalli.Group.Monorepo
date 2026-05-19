export type PayrollCycleFormalizationProps = {
  cicloInicial?: string;
  cicloFinal?: string;
  onConfirmFormalizacion?: () => void | Promise<void>;
  existPayrollInProgress?: boolean;
  statusLoading?: boolean;
  formalizeLoading?: boolean;
};
