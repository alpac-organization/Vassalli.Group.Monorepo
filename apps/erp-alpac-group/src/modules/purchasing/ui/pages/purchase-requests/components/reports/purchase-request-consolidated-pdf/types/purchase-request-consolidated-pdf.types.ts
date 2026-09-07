import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export interface PurchaseRequestConsolidatedPdfProps {
	companyAlias: string;
	logoUrl: string | null;
	requestTypeLabel: string;
	periodLabel: string;
	data: GetPurchaseRequestResponse[];
	totalQuantity: number;
	requestCount: number;
}