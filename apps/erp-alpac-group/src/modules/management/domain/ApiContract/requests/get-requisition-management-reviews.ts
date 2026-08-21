import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";

export interface GetRequisitionManagementReviewsRequest extends BaseRequest {
  page_number: number;
  page_size: number;
  status?: managementReviewStatusType;
}
