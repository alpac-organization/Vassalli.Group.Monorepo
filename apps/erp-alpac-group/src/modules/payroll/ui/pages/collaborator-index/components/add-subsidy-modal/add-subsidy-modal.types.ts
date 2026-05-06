
export type AddSubsidyModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};