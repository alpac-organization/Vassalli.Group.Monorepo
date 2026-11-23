import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";


interface PurchaseRequestInformation {
  code:                 string;
  purchase_request_id:  string;
  priority_level:       PriorityLevelType;
  request_type:         PurchaseRequestType;
}

export interface RequisitionAccountingReviewDto {
  comments:           string | null;
  sent_to_review_at:  string;
  purchase_requests_reviewed_accounting_id: string;
  status:                       accountingReviewStatusType;
  sent_by_user_information:     UserInformation;
  purchase_request_information: PurchaseRequestInformation;
}


export type GetRequisitionAccountingReviewsResponse =
  PaginateBaseResponse<RequisitionAccountingReviewDto>;
