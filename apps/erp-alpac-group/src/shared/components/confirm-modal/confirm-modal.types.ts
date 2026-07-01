export type ConfirmActionProps = {
   isOpen: boolean;
   type: ConfirmActionType;
   title: string;
   buttonActionLabel: string;
   buttonActionClass: string;
   isLoading?: boolean;
   disabled?: boolean;
   onClose?: () => void;
   handleFinalAction: (type: ConfirmActionType) => void;
}

export type ConfirmActionType = "APPROVE" | "REJECT" | "CANCEL";

export const ConfirmActionValueMap: Record<ConfirmActionType, boolean | null> = {
   APPROVE: true,
   REJECT: false,
   CANCEL: null,
};

