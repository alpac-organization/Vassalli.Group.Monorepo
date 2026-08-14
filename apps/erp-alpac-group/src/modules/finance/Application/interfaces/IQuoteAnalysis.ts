import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { GetQuoteAnalysisDetailsRequest } from "@app/modules/finance/domain/ApiContract/requests/quote-analysis-detail";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { AcceptOfferPurchaseRequest } from "@app/modules/finance/domain/ApiContract/requests/accept-offer-purchase";
import type { SendReviewToManagementRequest } from "@app/modules/finance/domain/ApiContract/requests/send-review-to-management";
export interface IQuoteAnalysis {
  GetQuoteAnalysis(
    payload: GetQuotesAnalysisRequest,
  ): Promise<GetRequisitionAccountingReviewsResponse>;
  GetQuoteAnalysisDetails(
    payload: GetQuoteAnalysisDetailsRequest,
  ): Promise<RequisitionAccountingReviewDetailsDto>;
  accceptQuotationToPurchase(
    payload: AcceptOfferPurchaseRequest,
  ): Promise<void>;
  sendReviewToManagement(payload: SendReviewToManagementRequest): Promise<void>;
}
