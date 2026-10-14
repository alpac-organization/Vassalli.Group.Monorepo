import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export type AnnulmentScope = 1 | 2 | "QuotationOnly" | "FullProcess";

export interface AnnulManagementReviewRequest extends BaseRequest {
	requisition_management_reviews_id: string;
	scope: AnnulmentScope;
	reason: string;
}
