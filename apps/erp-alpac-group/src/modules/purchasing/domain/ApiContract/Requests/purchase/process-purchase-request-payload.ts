import type { PurchaseRequestStatusType } from "@app/modules/purchasing/domain/enums/purchase-request-status.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export type ProcessPurchaseRequestStatus = Extract<
	PurchaseRequestStatusType,
	"Approved" | "Rejected" | "Canceled"
>;

export interface ProcessPurchaseRequestPayload extends BaseRequest {
	purchase_request_id: string;
	new_status: ProcessPurchaseRequestStatus;
	reason_rejection_id?: number | null;
	reason_rejection?: string | null;
}
