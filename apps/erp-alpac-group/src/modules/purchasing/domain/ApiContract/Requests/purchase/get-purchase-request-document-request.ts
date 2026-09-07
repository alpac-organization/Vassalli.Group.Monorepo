export interface GetPurchaseRequestDocumentRequest {
	company_id: string;
	module_code: string;
	document_type: number;
	consolidation_type?: number;
	purchase_request_id?: string;
	month?: number;
	year?: number;
}
