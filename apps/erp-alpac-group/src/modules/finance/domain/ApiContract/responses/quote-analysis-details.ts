import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type {
  BranchInformation,
  UserInformation,
  WorkAreaInformation,
} from "@app/shared/interfaces/organization-information/organization-information";

export interface PurchaseRequestDto {
  code: string | null;
  purchase_request_id: string;
  request_date: string;
  revision_date: string | null;
  request_type: PurchaseRequestType;
  request_status: PurchaseRequestStatusType;
  priority_level: string;
}

export interface PurchaseRequestDetailsDto extends PurchaseRequestDto {
  observations: string | null;
  reason_rejection: string | null;
  branch_information: BranchInformation;
  creator_user_information: UserInformation;
  reviewer_user_information: UserInformation | null;
  information_from_requesting_area: WorkAreaInformation;
}

export interface RequisitionAccountingReviewDto {
  comments: string | null;
  sent_to_review_at: string;
  status: accountingReviewStatusType;
  requisition_accounting_review_id: string;
  sent_by_user_information: UserInformation;
}

export interface RequisitionAccountingReviewDetailsDto extends RequisitionAccountingReviewDto {
  reviewed_by_user_id: string | null;
  purchase_request: PurchaseRequestDetailsDto;
}
