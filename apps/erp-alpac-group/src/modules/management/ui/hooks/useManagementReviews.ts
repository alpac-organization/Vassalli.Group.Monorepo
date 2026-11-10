import { warehouseHttpHandler } from "@app/core/adapters";
import { ManagementServices } from "../../infrastructure/services/ManagementServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ProcessPurchaseOrderPayload } from "../../domain/ApiContract/requests/process-purchase-order-payload";
import type { AnnulManagementReviewRequest } from "@app/modules/management/domain/ApiContract/requests/annul-management-review";
import {
	financeQueryKeys,
	invalidateManagementReviews,
	invalidatePurchaseOrders,
	managementQueryKeys,
	purchaseQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";

const managementServices = new ManagementServices(warehouseHttpHandler);

type UseManagementReviewsProps = {
	payloadGetRequisitionManagementReviews?: GetRequisitionManagementReviewsRequest;
};

export const useManagementReviews = (props?: UseManagementReviewsProps) => {
	const queryClient = useQueryClient();
	const { payloadGetRequisitionManagementReviews } = props || {};

	const listEnabled = Boolean(
		payloadGetRequisitionManagementReviews?.company_id?.trim() &&
			payloadGetRequisitionManagementReviews?.module_code?.trim(),
	);

	const GetRequisitionManagementReviews = useQuery<
		GetRequisitionManagementReviewsResponse,
		ApiErrorResponse
	>({
		queryKey: [
			managementQueryKeys.reviews,
			payloadGetRequisitionManagementReviews,
		],
		queryFn: () =>
			managementServices.GetRequisitionManagementReviews(
				payloadGetRequisitionManagementReviews!,
			),
		enabled: listEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const ProcessPurchaseOrder = useMutation<
		void,
		ApiErrorResponse,
		ProcessPurchaseOrderPayload
	>({
		mutationKey: ["process-purchase-order"],
		mutationFn: (payload) => managementServices.ProcessPurchaseOrder(payload),
		onSuccess: () => {
			void invalidateManagementReviews(queryClient);
			void invalidatePurchaseOrders(queryClient);
		},
		retry: 1,
	});

	const AnnulManagementReview = useMutation<
		void,
		ApiErrorResponse,
		AnnulManagementReviewRequest
	>({
		mutationKey: ["annul-management-review"],
		mutationFn: (payload) =>
			managementServices.annulManagementReview(payload),
		onSuccess: () => {
			void invalidateManagementReviews(queryClient);
			void queryClient.invalidateQueries({
				queryKey: [financeQueryKeys.quotesAnalysis],
			});
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.purchaseRequestsLegacy],
			});
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.requests],
			});
			void queryClient.invalidateQueries({
				queryKey: [purchaseQueryKeys.requestProducts],
			});
		},
		retry: 1,
	});

	return {
		GetRequisitionManagementReviews,
		ProcessPurchaseOrder,
		AnnulManagementReview,
	};
};
