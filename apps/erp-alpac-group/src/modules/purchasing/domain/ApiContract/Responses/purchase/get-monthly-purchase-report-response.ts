import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type MonthlyPurchaseReportCurrency = "NIO" | "USD";

export interface MonthlyPurchaseReportItemDto {
	month: number;
	year: number;
	key: string;
	request_type: PurchaseRequestType;
	branch_name: string;
	area_name: string;
	supplier_name: string;
	description: string;
	quantity: number;
	currency: MonthlyPurchaseReportCurrency;
	unit_price: number;
	total_price: number;
}

export interface GetMonthlyPurchaseReportResponse {
	items: MonthlyPurchaseReportItemDto[];
	grand_total: number;
}
