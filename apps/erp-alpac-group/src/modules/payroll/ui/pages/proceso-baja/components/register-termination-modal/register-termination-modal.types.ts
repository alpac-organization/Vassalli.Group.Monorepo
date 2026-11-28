export type RegisterTerminationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};
