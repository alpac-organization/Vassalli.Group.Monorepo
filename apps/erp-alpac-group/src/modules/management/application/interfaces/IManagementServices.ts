import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewDetailRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-review-detail";
import type { SendToRequest } from "@app/modules/management/domain/ApiContract/requests/send-to";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";

export interface IManagementServices {
  GetRequisitionManagementReviews(
    payload: GetRequisitionManagementReviewsRequest,
  ): Promise<GetRequisitionManagementReviewsResponse>;

  GetRequisitionManagementReviewDetail(
    payload: GetRequisitionManagementReviewDetailRequest,
  ): Promise<any>;

  SendTo(payload: SendToRequest): Promise<void>;
}
