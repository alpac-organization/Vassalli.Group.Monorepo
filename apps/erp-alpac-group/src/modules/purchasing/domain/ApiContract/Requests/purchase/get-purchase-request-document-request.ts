import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetPurchaseRequestDocumentRequest extends BaseRequest {
	document_type: number;
	consolidation_type?: number;
	purchase_request_id?: string;
	month?: number;
	year?: number;
}
