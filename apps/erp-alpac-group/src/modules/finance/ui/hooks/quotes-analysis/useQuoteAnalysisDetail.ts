import { QuoteAnalysisServices } from "@app/modules/finance/Infrastructure/services/QuoteAnalysisServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RequisitionAccountingReviewDetailsDto } from "@app/modules/finance/domain/ApiContract/responses/quote-analysis-details";
import type { GetQuoteAnalysisDetailsRequest } from "@app/modules/finance/domain/ApiContract/requests/quote-analysis-detail";
import type { AcceptOfferPurchaseRequest } from "@app/modules/finance/domain/ApiContract/requests/accept-offer-purchase";
import type { SendReviewToManagementRequest } from "@app/modules/finance/domain/ApiContract/requests/send-review-to-management";
import {
	financeQueryKeys,
	invalidateQuotesAnalysis,
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";

const quoteAnalysisService = new QuoteAnalysisServices(warehouseHttpHandler);

type UseQuoteAnalysisDetailProps = {
	payloadGetQuoteAnalysisDetails?: GetQuoteAnalysisDetailsRequest;
};

export const useQuoteAnalysisDetail = (
	props: UseQuoteAnalysisDetailProps,
) => {
	const { payloadGetQuoteAnalysisDetails } = props;
	const queryClient = useQueryClient();

	const detailEnabled = Boolean(
		payloadGetQuoteAnalysisDetails?.company_id?.trim() &&
			payloadGetQuoteAnalysisDetails?.module_code?.trim() &&
			payloadGetQuoteAnalysisDetails?.purchase_requests_reviewed_accounting_id?.trim(),
	);

	const GetQuoteAnalysisDetails = useQuery<
		RequisitionAccountingReviewDetailsDto,
		ApiErrorResponse
	>({
		queryKey: [
			financeQueryKeys.quotesAnalysisDetails,
			payloadGetQuoteAnalysisDetails,
		],
		queryFn: () =>
			quoteAnalysisService.GetQuoteAnalysisDetails(
				payloadGetQuoteAnalysisDetails as GetQuoteAnalysisDetailsRequest,
			),
		enabled: detailEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const AcceptQuotationToPurchase = useMutation<
		void,
		ApiErrorResponse,
		AcceptOfferPurchaseRequest
	>({
		mutationFn: (payload) =>
			quoteAnalysisService.accceptQuotationToPurchase(payload),
		onSuccess: () => {
			void invalidateQuotesAnalysis(queryClient);
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.requestProducts],
			});
		},
	});

	const SendReviewToManagement = useMutation<
		void,
		ApiErrorResponse,
		SendReviewToManagementRequest
	>({
		mutationFn: (payload) =>
			quoteAnalysisService.sendReviewToManagement(payload),
		onSuccess: () => {
			void invalidateQuotesAnalysis(queryClient);
		},
	});

	return {
		GetQuoteAnalysisDetails,
		AcceptQuotationToPurchase,
		SendReviewToManagement,
	};
};
