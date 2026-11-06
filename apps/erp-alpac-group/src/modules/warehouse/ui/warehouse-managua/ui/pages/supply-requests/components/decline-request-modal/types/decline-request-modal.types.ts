export type DeclineRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  observations: string;
  onObservationsChange: (value: string) => void;
  error?: string;
  isPending: boolean;
  onConfirm: () => void;
};