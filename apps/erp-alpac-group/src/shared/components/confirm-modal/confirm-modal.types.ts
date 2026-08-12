export type ConfirmActionProps = {
   isOpen: boolean;
   type: ConfirmActionType;
   title: string;
   buttonActionLabel: string;
   buttonActionClass?: string;
   buttonCancelClass?: string;
   isLoading?: boolean;
   disabled?: boolean;
   hasObservation?: boolean;
   observationLabel?: string,
	isObservationRequired?: boolean,
   onClose?: () => void;
   handleFinalAction: (type: ConfirmActionType, observation?: string) => void;
}

export type ConfirmActionType = "APPROVE" | "REJECT" | "CANCEL" | "DELETE" | "SEND";

export const ConfirmActionValueMap: Record<ConfirmActionType, boolean | null> = {
   APPROVE: true,
   REJECT: false,
   CANCEL: null,
   DELETE: null,
   SEND: null
};