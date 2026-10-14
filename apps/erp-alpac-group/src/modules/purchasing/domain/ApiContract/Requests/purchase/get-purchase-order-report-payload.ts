import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseOrderReportPayload extends BaseRequest {
	purchase_order_id: string;
}

export interface GetTransferRequestReportPayload extends BaseRequest {
	purchase_order_id: string;
}
