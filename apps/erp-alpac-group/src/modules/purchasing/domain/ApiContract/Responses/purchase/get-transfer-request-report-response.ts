import type { UserInformation } from "@app/shared/interfaces/organization-information/organization-information";

export type TransferRequestPaymentMethod = "BankTransfer" | "Check";
export type TransferRequestReportCurrency = "NIO" | "USD";

export interface TransferRequestReportItemDto {
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

export interface TransferRequestReportDocumentInfo {
	title: string;
	request_code: string;
	reference_number: string | null;
	date: string;
}

export interface TransferRequestReportPaymentInfo {
	supplier: string | null;
	customer: string | null;
	department: string | null;
	currency: TransferRequestReportCurrency;
	service_amount: number;
	iva: number;
	ir: number;
	imi: number;
	net_to_pay: number;
}

export interface TransferRequestReportCompanyInformation {
	company_name: string | null;
}

export interface TransferRequestReportDto {
	title: string;
	concept: string | null;
	purchase_order_id: string;
	payment_method: TransferRequestPaymentMethod;
	payment_request_code: string;
	payment_info: TransferRequestReportPaymentInfo;
	document_info: TransferRequestReportDocumentInfo;
	sent_by_user_information: UserInformation | null;
	approved_by_user_information: UserInformation | null;
	company_information: TransferRequestReportCompanyInformation | null;
	items: TransferRequestReportItemDto[];
}
