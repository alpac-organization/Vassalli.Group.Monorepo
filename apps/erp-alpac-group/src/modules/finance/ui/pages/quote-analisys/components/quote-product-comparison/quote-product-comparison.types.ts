import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { PurchaseRequestProductQuotation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export type QuoteProductComparisonProps = {
  itemId: string;
  quotations: PurchaseRequestProductQuotation[];
  selectedQuotationId?: string;
  onRequestAccept: (itemId: string, quotation: PurchaseRequestProductQuotation) => void;
  isAccepting?: boolean;
  accountingReviewStatus: accountingReviewStatusType;
};
