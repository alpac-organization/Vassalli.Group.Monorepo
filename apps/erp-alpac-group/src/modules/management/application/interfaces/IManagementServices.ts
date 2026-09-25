import type { GetRequisitionManagementReviewsRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-reviews";
import type { GetRequisitionManagementReviewDetailRequest } from "@app/modules/management/domain/ApiContract/requests/get-requisition-management-review-detail";
import type { ProcessPurchaseOrderPayload } from "@app/modules/management/domain/ApiContract/requests/process-purchase-order-payload";
import type { AnnulManagementReviewRequest } from "@app/modules/management/domain/ApiContract/requests/annul-management-review";
import type { GetRequisitionManagementReviewsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-reviews";
import type { RequisitionManagementReviewDetailsResponse } from "@app/modules/management/domain/ApiContract/responses/get-requisition-management-review-detail";

export interface IManagementServices {

  GetRequisitionManagementReviews(payload: GetRequisitionManagementReviewsRequest): Promise<GetRequisitionManagementReviewsResponse>;

  GetRequisitionManagementReviewDetails(payload: GetRequisitionManagementReviewDetailRequest): Promise<RequisitionManagementReviewDetailsResponse>;

  ProcessPurchaseOrder(payload: ProcessPurchaseOrderPayload): Promise<void>;

  annulManagementReview(payload: AnnulManagementReviewRequest): Promise<void>;
}
