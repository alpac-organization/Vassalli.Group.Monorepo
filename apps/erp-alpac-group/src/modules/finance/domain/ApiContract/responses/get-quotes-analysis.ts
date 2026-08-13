import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";
import type { UserStatusKey } from "@app/shared/enum/user-status";
export interface GetRequisitionAccountingReviewsResponse {
  data: RequisitionAccountingReviewDto[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface RequisitionAccountingReviewDto {
  comments: string;
  sent_to_review_at: string;
  status: accountingReviewStatusType;
  requisition_accounting_review_id: string;
  sent_by_user_information: SentByUserInformation;
}

export interface SentByUserInformation {
  user_id: string;
  email: string;
  fullname: string;
  picture_url: string;
  user_status: UserStatusKey;
  work_area_information: WorkAreaInformation;
}

export type ReviewerUserInformation = SentByUserInformation;

export interface GetRequisitionAccountingReviewsParams {
  area_id?: string;
  status?: accountingReviewStatusType;
  page_number?: number;
  page_size?: number;
}
interface WorkAreaInformation {
  work_area_id: string;
  work_area_code: string;
  description?: string;
  work_area_name?: string;
}
