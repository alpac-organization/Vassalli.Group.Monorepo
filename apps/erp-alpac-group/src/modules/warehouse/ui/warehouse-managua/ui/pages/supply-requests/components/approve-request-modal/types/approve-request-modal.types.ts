export type ApproveRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reasonOptions: Array<{ value: string; label: string }>;
  isLoadingReasons: boolean;
  selectedReasonId: string;
  onReasonChange: (value: string) => void;
  observations: string;
  onObservationsChange: (value: string) => void;
  error?: string;
  isPending: boolean;
  onConfirm: () => void;
};