import type { PurchaseRequestReturnHistoryEntry } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface QuoteReturnHistoryProps {
	requotationCount?: number | null;
	returnHistory?: PurchaseRequestReturnHistoryEntry[] | null;
}
