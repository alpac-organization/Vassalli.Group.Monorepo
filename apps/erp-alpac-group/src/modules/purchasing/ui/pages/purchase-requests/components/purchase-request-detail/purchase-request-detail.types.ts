export type PurchaseRequestDetailProps = {
   disableActions?: boolean;
   onRequestError?: (message?: string) => void;
   onRequestSuccess?: (message: string) => void;   
}