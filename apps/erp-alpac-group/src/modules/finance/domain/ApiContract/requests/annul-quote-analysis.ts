import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AnnulQuoteAnalysisRequest  extends BaseRequest {
	purchase_requests_reviewed_accounting_id: string;
	scope: number;
	reason: string;
}
