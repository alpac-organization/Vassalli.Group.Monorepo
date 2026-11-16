import { warehouseHttpHandler } from "@app/core/adapters";
import { ManagementServices } from "../../infrastructure/services/ManagementServices";
import { useQuery } from "@tanstack/react-query";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetRequisitionManagementReviewDetailRequest } from "../../domain/ApiContract/requests/get-requisition-management-review-detail";
import type { RequisitionManagementReviewDetailsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-review-detail";
import {
	managementQueryKeys,
	STALE_TIME_ONE_MINUTE,
} from "@app/modules/purchasing/ui/hooks/purchase/purchase-query-cache";

const managementServices = new ManagementServices(warehouseHttpHandler);

type UseManagementReviewDetailProps = {
	payloadGetRequisitionManagementReviewDetail?: GetRequisitionManagementReviewDetailRequest;
};

export const useManagementReviewDetail = (
	props?: UseManagementReviewDetailProps,
) => {
	const { payloadGetRequisitionManagementReviewDetail } = props || {};

	const detailEnabled = Boolean(
		payloadGetRequisitionManagementReviewDetail?.company_id?.trim() &&
			payloadGetRequisitionManagementReviewDetail?.module_code?.trim() &&
			payloadGetRequisitionManagementReviewDetail?.requisition_management_review_id?.trim(),
	);

	const GetRequisitionManagementReviewDetails = useQuery<
		RequisitionManagementReviewDetailsResponse,
		ApiErrorResponse
	>({
		queryKey: [
			managementQueryKeys.reviewDetails,
			payloadGetRequisitionManagementReviewDetail,
		],
		queryFn: () =>
			managementServices.GetRequisitionManagementReviewDetails(
				payloadGetRequisitionManagementReviewDetail!,
			),
		enabled: detailEnabled,
		staleTime: STALE_TIME_ONE_MINUTE,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	return { GetRequisitionManagementReviewDetails };
};
