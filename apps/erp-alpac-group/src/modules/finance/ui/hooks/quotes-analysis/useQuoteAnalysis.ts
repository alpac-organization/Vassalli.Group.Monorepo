import { QuoteAnalysisServices } from "@app/modules/finance/Infrastructure/services/QuoteAnalysisServices";
import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
const quoteAnalysisService = new QuoteAnalysisServices(warehouseHttpHandler);
type UseQuoteAnalysisProps = {
  payloadGetQuoteAnalysis?: GetQuotesAnalysisRequest;
};
export const useQuoteAnalysis = (props: UseQuoteAnalysisProps) => {
  const { payloadGetQuoteAnalysis } = props;
  const GetQuoteAnalysis = useQuery<
    GetRequisitionAccountingReviewsResponse,
    ApiErrorResponse
  >({
    queryKey: ["quotes-analysis", payloadGetQuoteAnalysis],
    queryFn: () =>
      quoteAnalysisService.GetQuoteAnalysis(
        payloadGetQuoteAnalysis as GetQuotesAnalysisRequest,
      ),
    enabled: Boolean(payloadGetQuoteAnalysis),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
  return {
    GetQuoteAnalysis,
  };
};
