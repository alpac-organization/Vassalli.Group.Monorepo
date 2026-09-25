import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { accountingReviewStatusType } from "@app/modules/finance/domain/enum/analysis-quotation/accounting-review-status";

export interface GetQuotesAnalysisRequest extends BaseRequest {
  page_number: number;
  page_size: number;
  area_id?: string;
  branch_id?: string;
  status?: accountingReviewStatusType;
}
