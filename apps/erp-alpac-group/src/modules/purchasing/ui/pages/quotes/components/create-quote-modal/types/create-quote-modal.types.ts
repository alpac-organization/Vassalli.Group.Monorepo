import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export type CreateQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (quote: any) => void;
  purchaseRequest?: GetPurchaseRequestResponse | null;
  onRequestSuccess?: (message: string) => void;
  onRequestError?: (message?: string) => void;
};
