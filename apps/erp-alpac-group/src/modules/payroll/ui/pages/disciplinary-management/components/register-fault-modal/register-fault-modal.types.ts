export type RegisterFaultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRequestSuccess?: (message: string) => void;
  onRequestError?: (message?: string) => void;
};
