import type { ConfirmActionType } from "@app/modules/applications/ui/pages/applications-index/types/confirm-action.types"

export type ConfirmActionProps = {
   isOpen: boolean;
   type: ConfirmActionType;
   onClose?: () => void;
   handleFinalAction: (type: ConfirmActionType) => void;
   isLoading?: boolean;
   disabled?: boolean;
}