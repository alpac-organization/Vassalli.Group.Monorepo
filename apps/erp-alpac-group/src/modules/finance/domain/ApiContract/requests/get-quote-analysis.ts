import type { accountingReviewStatusType } from "@app/modules/finance/enum/analysis-quotation/accounting-review-status";

export interface GetQuotesAnalysisRequest {
  company_id: string;
  module_code: string;
  page_number: number;
  page_size: number;
  area_id?: string;
  status?: accountingReviewStatusType;
}
