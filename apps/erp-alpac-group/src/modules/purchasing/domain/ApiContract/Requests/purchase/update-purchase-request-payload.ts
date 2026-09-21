import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdatePurchaseRequestPayload extends BaseRequest {
	purchase_request_id: string;
	observations?: string;
	priority_level?: number;
	destination_request?: number;
	purchase_request_items?: UpdatePurchaseRequestItem[];
}

export interface UpdatePurchaseRequestItem {
	id: string;
	quantity?: number;
	quantity_unit?: number;
	product_id?: string;
	unit_measure_id?: string;
	description?: string;
	justification?: string;
	images_product_to_changed?: string[];
}
