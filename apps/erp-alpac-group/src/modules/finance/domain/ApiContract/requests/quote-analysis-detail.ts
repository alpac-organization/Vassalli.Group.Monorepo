import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetQuoteAnalysisDetailsRequest extends BaseRequest {
  purchase_requests_reviewed_accounting_id: string;
}
