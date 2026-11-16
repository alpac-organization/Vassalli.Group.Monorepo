import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseOrdersPayload extends BaseRequest {
	page_number?: number;
	page_size?: number;
	area_id?: string;
	branch_id?: string;
}