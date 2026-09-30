import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { GetPurchaseRequestDetailResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface RequisitionManagementReviewDto {
  comments: string | null;
  sent_to_review_at: string;
  status: managementReviewStatusType;
  purchase_requests_reviewed_management_id: string;
  sent_by_user_information: UserInformation;
  purchase_request: GetPurchaseRequestDetailResponse;
}

export type GetRequisitionManagementReviewsResponse = PaginateBaseResponse<RequisitionManagementReviewDto[]>;
