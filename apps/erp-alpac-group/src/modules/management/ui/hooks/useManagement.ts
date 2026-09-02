import { warehouseHttpHandler } from "@app/core/adapters";
import { ManagementServices } from "../../infrastructure/services/ManagementServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetRequisitionManagementReviewDetailRequest } from "../../domain/ApiContract/requests/get-requisition-management-review-detail";
import type { RequisitionManagementReviewDetailsRequest } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-review-detail";
import type { ProcessPurchaseOrderPayload } from "../../domain/ApiContract/requests/process-purchase-order-payload";

const managementServices = new ManagementServices(warehouseHttpHandler);

type UseManagementProps = {
    payloadGetRequisitionManagementReviews?: GetRequisitionManagementReviewsRequest;
    payloadGetRequisitionManagementReviewDetail?: GetRequisitionManagementReviewDetailRequest;
};

export const useManagement = (props?: UseManagementProps) => {

    const queryClient = useQueryClient();

    const {
        payloadGetRequisitionManagementReviews,
        payloadGetRequisitionManagementReviewDetail
    } = props || {};

    const payloadGetRequisitionManagementReviewsEnabled = Boolean(
        payloadGetRequisitionManagementReviews?.company_id &&
        payloadGetRequisitionManagementReviews?.module_code,
    );

    const payloadGetRequisitionManagementReviewDetailsEnabled = Boolean(
        payloadGetRequisitionManagementReviewDetail?.company_id &&
        payloadGetRequisitionManagementReviewDetail?.module_code &&
        payloadGetRequisitionManagementReviewDetail?.requisition_management_review_id
    );

    const GetRequisitionManagementReviews = useQuery<GetRequisitionManagementReviewsResponse, ApiErrorResponse>({
        queryKey: ["requisition-management-reviews", payloadGetRequisitionManagementReviews],
        queryFn: () => managementServices.GetRequisitionManagementReviews(payloadGetRequisitionManagementReviews!),
        enabled: payloadGetRequisitionManagementReviewsEnabled,
        staleTime: 1000 * 60 * 1,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const GetRequisitionManagementReviewDetails = useQuery<RequisitionManagementReviewDetailsRequest, ApiErrorResponse>({
        queryKey: ["requisition-management-review-details", payloadGetRequisitionManagementReviewDetail],
        queryFn: () => managementServices.GetRequisitionManagementReviewDetails(payloadGetRequisitionManagementReviewDetail!),
        enabled: payloadGetRequisitionManagementReviewDetailsEnabled,
        staleTime: 1000 * 60 * 1,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const ProcessPurchaseOrder = useMutation<void, ApiErrorResponse, ProcessPurchaseOrderPayload>({
        mutationKey: ["process-purchase-order"],
        mutationFn: (payload: ProcessPurchaseOrderPayload) => managementServices.ProcessPurchaseOrder(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["requisition-management-reviews"] }),
        retry: 1
    });

    return {
        GetRequisitionManagementReviews,
        GetRequisitionManagementReviewDetails,
        ProcessPurchaseOrder,
    };
};
