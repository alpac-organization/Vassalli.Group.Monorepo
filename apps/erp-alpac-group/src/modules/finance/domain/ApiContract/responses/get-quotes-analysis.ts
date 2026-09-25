import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";
import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface RequisitionAccountingReviewDto {
  comments: string | null;
  sent_to_review_at: string;
  purchase_requests_reviewed_accounting_id: string;
  status: accountingReviewStatusType;
  sent_by_user_information: UserInformation;
}

export type GetRequisitionAccountingReviewsResponse = PaginateBaseResponse<RequisitionAccountingReviewDto[]>;
