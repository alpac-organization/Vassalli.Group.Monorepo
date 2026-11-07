import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface RequisitionManagementReviewPurchaseRequest {
  purchase_request_id: string;
  code: string | null;
  request_date: string;
  revision_date: string | null;
  priority_level: PriorityLevelType;
  destination: PurchaseRequestDestinationType;
  request_type: PurchaseRequestType;
  request_status: PurchaseRequestStatusType;
  is_accounting_approved: boolean;
  is_management_approved: boolean;
  is_purchase_order_generated: boolean;
}

export interface RequisitionManagementReviewDto {
  comments: string | null;
  sent_to_review_at: string;
  status: managementReviewStatusType;
  purchase_requests_reviewed_management_id: string;
  sent_by_user_information: UserInformation;
  purchase_request: RequisitionManagementReviewPurchaseRequest;
}

export type GetRequisitionManagementReviewsResponse =
  PaginateBaseResponse<RequisitionManagementReviewDto>;
