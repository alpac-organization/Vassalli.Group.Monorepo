import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

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
  purchase_requests_reviewed_accounting_id: string;
  sent_by_user_information: UserInformation;
  purchase_request?: {
    purchase_request_id: string;
    code?: string | null;
  } | null;
}

export interface GetRequisitionAccountingReviewsParams {
  area_id?: string;
  status?: accountingReviewStatusType;
  page_number?: number;
  page_size?: number;
}
