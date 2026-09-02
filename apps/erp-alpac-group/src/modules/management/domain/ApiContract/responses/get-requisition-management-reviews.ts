import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

export interface GetRequisitionManagementReviewsResponse {
  data: RequisitionManagementReviewDto[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface RequisitionManagementReviewDto {
  comments: string | null;
  sent_to_review_at: string;
  status: managementReviewStatusType;
  purchase_requests_reviewed_management_id: string;
  purchase_request: PurchaseRequestInformation;
  sent_by_user_information: UserInformation;
}

export interface PurchaseRequestInformation {
  code: string | null;
  purchase_request_id: string;
  request_date: string;
  revision_date: string | null;
  priority_level: PriorityLevelType;
  destination: string;
  request_type: PurchaseRequestType;
  request_status: PurchaseRequestStatusType;
}
