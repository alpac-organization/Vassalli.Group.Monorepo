import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ProcessPurchaseRequestPayload extends BaseRequest {
	purchase_request_id: string;	
	reason_rejection?: string | null;
	new_status: number;
}
