import { warehouseHttpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { AnnulPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/annul-purchase-request-payload";
import type { DeletePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/delete-purchase-request-payload";
import type { GetPurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/get-purchase-request-payload";
import type { SendPurchaseRequestToReviewPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/send-purchase-request-review-payload";
import { PurchaseServices } from "@app/modules/purchasing/infrastructure/services/purchase/PurchaseServices";
import {
	financeQueryKeys,
	invalidateManagementReviews,
	invalidatePurchaseRequestList,
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const purchaseServices = new PurchaseServices(warehouseHttpHandler);

type UsePurchaseRequestListProps = {
	getPurchaseRequestsPayload?: GetPurchaseRequestPayload;
};

export const usePurchaseRequestList = (props?: UsePurchaseRequestListProps) => {
	const { getPurchaseRequestsPayload } = props || {};
	const queryClient = useQueryClient();

	const purchaseRequestListEnabled = Boolean(
		(getPurchaseRequestsPayload?.company_id?.trim() &&
			getPurchaseRequestsPayload?.module_code?.trim()) ||
			getPurchaseRequestsPayload?.page_number,
	);

	const GetPurchaseRequests = useQuery({
		queryKey: [purchaseQueryKeys.requests, getPurchaseRequestsPayload],
		queryFn: () =>
			purchaseServices.GetPurchaseRequests(getPurchaseRequestsPayload!),
		enabled: purchaseRequestListEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const DeletePurchaseRequest = useMutation<
		void,
		ApiErrorResponse,
		DeletePurchaseRequestPayload
	>({
		mutationKey: ["delete-purchase-request"],
		mutationFn: (payload) => purchaseServices.DeletePurchaseRequest(payload),
		onSuccess: () => {
			void invalidatePurchaseRequestList(queryClient);
		},
		retryDelay: 2000,
		retry: 1,
	});

	const SendPurchaseRequestToReview = useMutation<
		void,
		ApiErrorResponse,
		SendPurchaseRequestToReviewPayload
	>({
		mutationKey: ["send-purchase-request-to-review"],
		mutationFn: (payload) =>
			purchaseServices.SendPurchaseRequestToReview(payload),
		onSuccess() {
			void invalidatePurchaseRequestList(queryClient);
			void queryClient.invalidateQueries({
				queryKey: [financeQueryKeys.quotesAnalysis],
				refetchType: "all",
			});
		},
		retry: 1,
	});

	const AnnulPurchaseRequest = useMutation<
		void,
		ApiErrorResponse,
		AnnulPurchaseRequestPayload
	>({
		mutationKey: ["annul-purchase-request"],
		mutationFn: (payload) => purchaseServices.AnnulPurchaseRequest(payload),
		onSuccess() {
			void invalidatePurchaseRequestList(queryClient);
			void queryClient.invalidateQueries({
				queryKey: [financeQueryKeys.quotesAnalysis],
			});
			void invalidateManagementReviews(queryClient);
		},
		retry: 1,
	});

	return {
		GetPurchaseRequests,
		DeletePurchaseRequest,
		SendPurchaseRequestToReview,
		AnnulPurchaseRequest,
	};
};
