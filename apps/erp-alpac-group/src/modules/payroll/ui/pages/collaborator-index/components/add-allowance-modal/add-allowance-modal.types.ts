
export type AddAllowanceModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSubmit?: (data: any) => void;
   onRequestSuccess?: (message: string) => void;
   onRequestError?: (message?: string) => void;
};