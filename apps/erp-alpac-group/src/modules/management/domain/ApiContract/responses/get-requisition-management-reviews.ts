import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { UserStatusKey } from "@app/shared/enum/user-status";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";

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
  requisition_management_review_id: string;
  purchase_request: PurchaseRequestInformation;
  sent_by_user_information: SentByUserInformation;
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

export interface SentByUserInformation {
  user_id: string;
  email: string | null;
  fullname: string | null;
  picture_url: string | null;
  user_status: UserStatusKey;
  work_area_information: WorkAreaInformation;
}

export interface WorkAreaInformation {
  work_area_id: string;
  work_area_code: number;
  description: string | null;
  work_area_name: string | null;
  cost_centers: CostCenterInformation[] | null;
}

export interface CostCenterInformation {
  cost_center_id: string;
  description: string | null;
  cost_center_name: string | null;
  coil_code: number;
  cost_center_code: number;
}
