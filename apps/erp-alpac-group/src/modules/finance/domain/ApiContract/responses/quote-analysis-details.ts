import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { UserStatusKey } from "@app/shared/enum/user-status";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";

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
  creator_user_information: CreatorUserInformation;
  reviewer_user_information: ReviewerUserInformation | null;
  information_from_requesting_area: WorkAreaInformation;
}

export interface BranchInformation {
  branch_id: string;
  branch_code: string | null;
  branch_name: string | null;
  company_alias: string | null;
}

export interface SentByUserInformation {
  user_id: string;
  email: string | null;
  fullname: string | null;
  picture_url: string | null;
  user_status: UserStatusKey;
  work_area_information: WorkAreaInformation;
}

export type CreatorUserInformation = SentByUserInformation;

export type ReviewerUserInformation = SentByUserInformation;

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

export interface RequisitionAccountingReviewDto {
  comments: string | null;
  sent_to_review_at: string;
  status: accountingReviewStatusType;
  requisition_accounting_review_id: string;
  sent_by_user_information: SentByUserInformation;
}

export interface RequisitionAccountingReviewDetailsDto extends RequisitionAccountingReviewDto {
  reviewed_by_user_id: string | null;
  purchase_request: PurchaseRequestDetailsDto;
}
