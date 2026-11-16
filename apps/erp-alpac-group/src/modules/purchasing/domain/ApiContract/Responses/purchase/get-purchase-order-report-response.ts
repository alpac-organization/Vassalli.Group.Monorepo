import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

export type PurchaseOrderPaymentCondition = "Credit" | "Cash";
export type PurchaseOrderReportCurrency = "NIO" | "USD";

export interface PurchaseOrderReportItemDto {
	purchase_order_item_id: string;
	purchase_request_item_id: string | null;
	product_id: string;
	product_name: string | null;
	product_code: string | null;
	quantity: number;
	unit_measure: string | null;
	unit_price: number;
	price_total: number;
	iva: number;
}

export interface PurchaseOrderReportDocumentInfo {
	title: string;
	request_code: string;
	reference_number: string | null;
	date: string;
	is_normal: boolean;
	is_critical: boolean;
	is_unforeseen: boolean;
}

export interface PurchaseOrderReportPaymentInfo {
	supplier: string | null;
	customer: string | null;
	department: string | null;
	currency: PurchaseOrderReportCurrency;
	service_amount: number;
	iva: number;
	income_tax: number;
	net_to_pay: number;
}

export interface PurchaseOrderReportCompanyInformation {
	company_name: string | null;
}

export interface PurchaseOrderTemplateDto {
	title: string;
	concept: string | null;
	purchase_order_id: string;
	purchase_order_code: string;
	payment_condition: PurchaseOrderPaymentCondition;
	payment_request_code: string | null;
	payment_info: PurchaseOrderReportPaymentInfo;
	document_info: PurchaseOrderReportDocumentInfo;
	sent_by_user_information: UserInformation | null;
	company_information: PurchaseOrderReportCompanyInformation | null;
	items: PurchaseOrderReportItemDto[];
}
