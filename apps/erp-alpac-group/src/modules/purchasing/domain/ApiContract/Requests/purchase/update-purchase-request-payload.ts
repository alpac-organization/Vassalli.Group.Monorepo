import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdatePurchaseRequestPayload extends BaseRequest {
	purchase_request_id: string;
	observations?: string | null;
	priority_level?: number;
	destination_request?: number;
	purchase_request_items?: UpdatePurchaseRequestItemPayload[];
}

/** Existing item in PATCH — identified by id. */
export interface UpdateExistingPurchaseRequestItem {
	id: string;
	quantity?: number;
	quantity_unit?: number;
	product_id?: string;
	unit_measure_id?: string;
	description?: string;
	justification?: string;
	images_product_to_changed?: string[];
}

/** New item in PATCH — same shape as create item (no id). */
export interface UpdateNewPurchaseRequestItem {
	product_id: string;
	quantity: number;
	quantity_unit?: number;
	unit_measure_id: string;
	description: string;
	justification?: string;
	additional_data?: string | null;
}

export type UpdatePurchaseRequestItemPayload =
	| UpdateExistingPurchaseRequestItem
	| UpdateNewPurchaseRequestItem;
