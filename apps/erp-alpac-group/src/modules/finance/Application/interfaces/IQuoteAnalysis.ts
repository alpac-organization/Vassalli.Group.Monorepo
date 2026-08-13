import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";

export interface IQuoteAnalysis {
  GetQuoteAnalysis(
    payload: GetQuotesAnalysisRequest,
  ): Promise<GetRequisitionAccountingReviewsResponse>;
}
