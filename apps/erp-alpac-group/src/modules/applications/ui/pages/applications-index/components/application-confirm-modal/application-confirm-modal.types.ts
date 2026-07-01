import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";

export type ApplicationConfirmActionProps = {
   isOpen: boolean;
   type: ConfirmActionType;
   onClose?: () => void;
   handleFinalAction: (type: ConfirmActionType) => void;
   isLoading?: boolean;
   disabled?: boolean;
}