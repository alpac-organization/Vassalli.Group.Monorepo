export type SendReviewModalConfirmPayload = {
  comments: string | null;
  isApproved: boolean;
};

export type SendReviewModalProps = {
  isOpen: boolean;
  pendingLabel: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: SendReviewModalConfirmPayload) => void;
};
