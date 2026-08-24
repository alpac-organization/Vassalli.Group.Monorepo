export interface NotificationConfirmProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void | Promise<void>;
   isLoading?: boolean;
}
