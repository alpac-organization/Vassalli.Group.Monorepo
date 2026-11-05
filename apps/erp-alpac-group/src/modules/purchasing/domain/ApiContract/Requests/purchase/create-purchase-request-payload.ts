import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";

export interface PurchaseRequestMainPayload extends BaseRequest {
	purchase_requests: CreatePurchaseRequestPayload[];
}

export interface CreatePurchaseRequestPayload {
	observations: 		   string;
	request_type: 		   PurchaseRequestType;
	destination: 		   PurchaseRequestDestinationType;
	priority_level?:       PriorityLevelType;

	area_id?: 			   string | null;
	operational_order_id?: string | null;
	purchase_request_items: PurchaseRequestItem[];
}

export interface PurchaseRequestItem {
	quantity: 					number;
	product_id: 				string;
	description: 				string;
	justification:   			string;
	unit_measure_id: 			string;
	quantity_unit?: 			number | null;
	additional_data?: 			string | null;
}

export interface PurchaseRequestItemAdditionalData {
	images_product_to_changed: string[]
}