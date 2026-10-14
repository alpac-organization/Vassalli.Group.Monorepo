import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export interface MonthlyPurchaseReportItemDto {
	month: number;
	year: number;
	key: string;
	request_type: PurchaseRequestType;
	branch_name: string | null;
	area_name: string | null;
	supplier_name: string | null;
	description: string | null;
	quantity: number;
	unit_price: number;
	total_price: number;
}

export type GetMonthlyPurchaseReportResponse = MonthlyPurchaseReportItemDto[];
