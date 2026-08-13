import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export type QuoteProductComparisonProps = {
  itemId: string;
  quotations: PurchaseRequestProductQuotation[];
  selectedQuotationId?: string;
  onSelectQuotation: (itemId: string, quotationId: string) => void;
  onDeselectQuotation: (itemId: string) => void;
};
