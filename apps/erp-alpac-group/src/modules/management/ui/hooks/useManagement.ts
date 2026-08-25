import { warehouseHttpHandler } from "@app/core/adapters";
import { ManagementServices } from "../../infrastructure/services/ManagementServices";
import { useQuery } from "@tanstack/react-query";
import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const managementServices = new ManagementServices(warehouseHttpHandler);

type UseManagementProps = {
    payloadGetRequisitionManagementReviews?: GetRequisitionManagementReviewsRequest;
};

export const useManagement = (props?: UseManagementProps) => {
    const { payloadGetRequisitionManagementReviews } = props || {};

    const payloadGetRequisitionManagementReviewsEnabled = Boolean(
        payloadGetRequisitionManagementReviews?.company_id &&
        payloadGetRequisitionManagementReviews?.module_code,
    );

    const GetRequisitionManagementReviews = useQuery<GetRequisitionManagementReviewsResponse, ApiErrorResponse>({
        queryKey: ["requisition-management-reviews", payloadGetRequisitionManagementReviews],
        queryFn: () => managementServices.GetRequisitionManagementReviews(payloadGetRequisitionManagementReviews!),
        enabled: payloadGetRequisitionManagementReviewsEnabled,
        staleTime: 1000 * 60 * 1,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    return {
        GetRequisitionManagementReviews,
    };
};
