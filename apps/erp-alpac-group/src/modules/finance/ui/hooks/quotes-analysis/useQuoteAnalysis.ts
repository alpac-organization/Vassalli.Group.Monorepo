import { QuoteAnalysisServices } from "@app/modules/finance/Infrastructure/services/QuoteAnalysisServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { GetQuoteAnalysisDetailsRequest } from "@app/modules/finance/domain/ApiContract/requests/quote-analysis-detail";
import type { AcceptOfferPurchaseRequest } from "@app/modules/finance/domain/ApiContract/requests/accept-offer-purchase";
import type { SendReviewToManagementRequest } from "@app/modules/finance/domain/ApiContract/requests/send-review-to-management";
const quoteAnalysisService = new QuoteAnalysisServices(warehouseHttpHandler);
type UseQuoteAnalysisProps = {
  payloadGetQuoteAnalysis?: GetQuotesAnalysisRequest;
  payloadGetQuoteAnalysisDetails?: GetQuoteAnalysisDetailsRequest;
};
export const useQuoteAnalysis = (props: UseQuoteAnalysisProps) => {
  const { payloadGetQuoteAnalysis, payloadGetQuoteAnalysisDetails } = props;
  const queryClient = useQueryClient();
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
  const GetQuoteAnalysisDetails = useQuery<
    RequisitionAccountingReviewDetailsDto,
    ApiErrorResponse
  >({
    queryKey: ["quotes-analysis-details", payloadGetQuoteAnalysisDetails],
    queryFn: () =>
      quoteAnalysisService.GetQuoteAnalysisDetails(
        payloadGetQuoteAnalysisDetails as GetQuoteAnalysisDetailsRequest,
      ),
    enabled: Boolean(payloadGetQuoteAnalysisDetails),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
  const AcceptQuotationToPurchase = useMutation<
    void,
    ApiErrorResponse,
    AcceptOfferPurchaseRequest
  >({
    mutationFn: (payload: AcceptOfferPurchaseRequest) =>
      quoteAnalysisService.accceptQuotationToPurchase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes-analysis"] });
      queryClient.invalidateQueries({ queryKey: ["quotes-analysis-details"] });
      queryClient.invalidateQueries({
        queryKey: ["get-purchase-request-products"],
      });
    },
  });
  const SendReviewToManagement = useMutation<
    void,
    ApiErrorResponse,
    SendReviewToManagementRequest
  >({
    mutationFn: (payload: SendReviewToManagementRequest) =>
      quoteAnalysisService.sendReviewToManagement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes-analysis"] });
      queryClient.invalidateQueries({ queryKey: ["quotes-analysis-details"] });
    },
  });
  return {
    GetQuoteAnalysis,
    GetQuoteAnalysisDetails,
    AcceptQuotationToPurchase,
    SendReviewToManagement,
  };
};
