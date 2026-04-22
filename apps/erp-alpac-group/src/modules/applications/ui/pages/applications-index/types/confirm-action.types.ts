export type ConfirmActionType = "APPROVE" | "REJECT" | "CANCEL";

export const ConfirmActionValueMap: Record<ConfirmActionType, boolean | null> = {
   APPROVE: true,
   REJECT: false,
   CANCEL: null,
};

