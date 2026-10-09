import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { managementReviewStatusType } from "@app/modules/management/domain/enum/management-review-status";

export type ProcessPurchaseOrderStatus = Extract<
	managementReviewStatusType,
	"Approved" | "Rejected"
>;

export interface ProcessPurchaseOrderPayload extends BaseRequest {
	requisition_management_review_id: string;
	new_status: ProcessPurchaseOrderStatus;
	comments: string;
}
