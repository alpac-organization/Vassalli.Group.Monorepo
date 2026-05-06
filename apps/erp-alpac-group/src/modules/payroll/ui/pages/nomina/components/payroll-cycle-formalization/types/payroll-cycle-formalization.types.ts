export type PayrollCycleFormalizationProps = {
  cicloInicial?: string;
  cicloFinal?: string;
  onConfirmFormalizacion?: () => void;
  existPayrollInProgress?: boolean;
  statusLoading?: boolean;
};
