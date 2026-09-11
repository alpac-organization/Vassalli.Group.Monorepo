export type PurchaseRequestDetailProps = {
   disableActions?: boolean;
   lockItems?: boolean;
   onRequestError?: (message?: string) => void;
   onRequestSuccess?: (message: string) => void;
}