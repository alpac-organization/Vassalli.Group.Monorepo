import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdatePurchaseRequestPayload extends BaseRequest {
	purchase_request_id: string;
	observations?: string | null;
	priority_level?: PriorityLevelType;
	/** Note: register uses `destination`; PATCH uses `destination_request`. */
	destination_request?: PurchaseRequestDestinationType;
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

/** New item in PATCH — id null/absent; requires product_id, unit_measure_id, quantity. */
export interface UpdateNewPurchaseRequestItem {
	id?: null;
	product_id: string;
	quantity: number;
	quantity_unit?: number;
	unit_measure_id: string;
	description?: string;
	justification?: string;
	additional_data?: string | null;
	images_product_to_changed?: string[];
}

export type UpdatePurchaseRequestItemPayload =
	| UpdateExistingPurchaseRequestItem
	| UpdateNewPurchaseRequestItem;
