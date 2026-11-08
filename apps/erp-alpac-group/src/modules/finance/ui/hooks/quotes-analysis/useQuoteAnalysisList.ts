import { QuoteAnalysisServices } from "@app/modules/finance/Infrastructure/services/QuoteAnalysisServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { GetQuotesAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/get-quote-analysis";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetRequisitionAccountingReviewsResponse } from "@app/modules/finance/domain/ApiContract/responses/get-quotes-analysis";
import type { SendReviewToManagementRequest } from "@app/modules/finance/domain/ApiContract/requests/send-review-to-management";
import type { AnnulQuoteAnalysisRequest } from "@app/modules/finance/domain/ApiContract/requests/annul-quote-analysis";
import {
	financeQueryKeys,
	invalidateQuotesAnalysis,
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";

const quoteAnalysisService = new QuoteAnalysisServices(warehouseHttpHandler);

type UseQuoteAnalysisListProps = {
	payloadGetQuoteAnalysis?: GetQuotesAnalysisRequest;
};

export const useQuoteAnalysisList = (props: UseQuoteAnalysisListProps) => {
	const { payloadGetQuoteAnalysis } = props;
	const queryClient = useQueryClient();

	const listEnabled = Boolean(
		payloadGetQuoteAnalysis?.company_id?.trim() &&
			payloadGetQuoteAnalysis?.module_code?.trim(),
	);

	const GetQuoteAnalysis = useQuery<
		GetRequisitionAccountingReviewsResponse,
		ApiErrorResponse
	>({
		queryKey: [financeQueryKeys.quotesAnalysis, payloadGetQuoteAnalysis],
		queryFn: () =>
			quoteAnalysisService.GetQuoteAnalysis(
				payloadGetQuoteAnalysis as GetQuotesAnalysisRequest,
			),
		enabled: listEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
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

	const AnnulQuoteAnalysis = useMutation<
		void,
		ApiErrorResponse,
		AnnulQuoteAnalysisRequest
	>({
		mutationFn: (payload) => quoteAnalysisService.annulQuoteAnalysis(payload),
		onSuccess: () => {
			void invalidateQuotesAnalysis(queryClient);
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.requestProducts],
			});
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.purchaseRequestsLegacy],
			});
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.requests],
			});
		},
	});

	return {
		GetQuoteAnalysis,
		SendReviewToManagement,
		AnnulQuoteAnalysis,
	};
};
