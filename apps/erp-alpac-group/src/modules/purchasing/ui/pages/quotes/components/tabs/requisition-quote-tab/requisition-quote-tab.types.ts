export type RequisitionQuoteTabProps = {
   currentBranchId: string;
   onRequestError: (message?: string) => void;
   onRequestSuccess: (message: string) => void;
};