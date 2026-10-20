import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface AcceptQuotationForPurchaseRequest extends BaseRequest {
	quotation_id: string;
	purchase_request_item_id: string;
	supplier_selection_justification: string;
}
