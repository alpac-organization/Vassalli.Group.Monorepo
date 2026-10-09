import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

/** PaymentMethod en reportes de OC / solicitud de pago. */
export type PurchaseOrderReportPaymentMethod =
	| "BankTransfer"
	| "Check"
	| "Credit"
	| 1
	| 2
	| 3;

export interface PurchaseOrderTaxMetadata {
	exchange_rate: number;
	total_nio: number;
	imi_amount: number;
	ir_amount: number;
	imi_rate: number;
	ir_rate: number;
	retentions_applied: boolean;
	supplier_type: string | null;
	ir_tax_type: string | null;
	payment_request_code: string | null;
}

export interface PurchaseOrderReportItemDto {
	purchase_order_item_id: string;
	purchase_request_item_id: string | null;
	product_id: string;
	product_name: string | null;
	product_code: string | null;
	quantity: number;
	unit_price: number;
	price_total: number;
	iva: number;
}

export interface PurchaseOrderReportDocumentInfo {
	title: string | null;
	request_code: string | null;
	reference_number?: string | null;
	date: string | null;
	assignment_number?: string | null;
	is_normal?: boolean;
	is_critical?: boolean;
	administrative_fine_number?: string | null;
	declaration_number?: string | null;
	quote_count: number;
}

export interface PurchaseOrderReportPaymentInfo {
	payee: string | null;
	customer: string | null;
	department: string | null;
	customs?: string | null;
	service_amount: number;
	exempt_service_amount?: number;
	other_disbursement?: number;
	vat: number;
	income_tax: number;
	municipal_tax: number;
	others?: number;
	net_to_pay: number;
}

/** Company payload from report template (core / branch.company). */
export interface PurchaseOrderReportCompanyInformation {
	company_id?: string;
	alias?: string | null;
	company_name?: string | null;
	image_url?: string | null;
	[key: string]: unknown;
}

export interface PurchaseOrderTemplateDto {
	title: string | null;
	concept: string | null;
	purchase_order_id: string;
	purchase_order_code: string | null;
	payment_method: PurchaseOrderReportPaymentMethod | null;
	payment_request_code: string | null;
	tax: PurchaseOrderTaxMetadata | null;
	document_info: PurchaseOrderReportDocumentInfo;
	payment_info: PurchaseOrderReportPaymentInfo;
	sent_by_user_information: UserInformation;
	company_information: PurchaseOrderReportCompanyInformation;
	items: PurchaseOrderReportItemDto[];
}
