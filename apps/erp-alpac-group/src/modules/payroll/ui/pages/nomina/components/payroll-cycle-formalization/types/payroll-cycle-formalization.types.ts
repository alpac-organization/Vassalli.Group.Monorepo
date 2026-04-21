export type PayrollCycleFormalizationProps = {
  cicloInicial?: string;
  cicloFinal?: string;
  onConfirmFormalizacion?: () => void;
  existPayrollInProgress?: boolean;
  statusLoading?: boolean;
  statusError?: boolean;
  onRetryProcessStatus?: () => void;
  onRequestChangePayrollSelection?: () => void;
};
