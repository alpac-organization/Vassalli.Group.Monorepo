import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export interface GetRequisitionManagementReviewsRequest extends BaseRequest {
  page_number?: number;
  page_size?: number;
  status?: managementReviewStatusType;
  area_id?: string;
  branch_id?: string;
  code?: string;
  priority_level?: PriorityLevelType;
  request_type?: PurchaseRequestType;
}
