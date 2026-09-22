import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AnnulManagementReviewRequest  extends BaseRequest {
	requisition_management_reviews_id: string;
	scope: number;
	reason: string;
}
