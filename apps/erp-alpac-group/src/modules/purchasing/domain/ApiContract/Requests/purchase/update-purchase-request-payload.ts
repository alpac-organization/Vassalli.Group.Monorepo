import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";

//Payload padre para actualizar solicitud compra
export interface UpdatePurchaseRequestPayload extends BaseRequest {
	observations?: 			 string | null;
	purchase_request_id: 	 string;
	priority_level?: 		 PriorityLevelType;
	destination_request?: 	 PurchaseRequestDestinationType;
	purchase_request_items?: UpdatePurchaseRequestItemPayload[];
}

//Payload item para actualizar los hijos de una solicitud de compras
export interface UpdateExistingPurchaseRequestItem {
	id: 						string;
	quantity?: 					number;
	quantity_unit?: 			number;
	product_id?: 				string;
	unit_measure_id?: 			string;
	description?: 				string;
	justification?: 			string;
	additional_data?:			string;
	images_product_to_changed?: string[];
}

export interface UpdateNewPurchaseRequestItem {
	id?: 						null;
	product_id: 				string;
	quantity: 					number;
	quantity_unit?: 			number;
	unit_measure_id: 			string;
	description?: 				string;
	justification?: 			string;
	additional_data?: 			string | null;
	images_product_to_changed?: string[];
}

export type UpdatePurchaseRequestItemPayload =
	| UpdateExistingPurchaseRequestItem
	| UpdateNewPurchaseRequestItem;
