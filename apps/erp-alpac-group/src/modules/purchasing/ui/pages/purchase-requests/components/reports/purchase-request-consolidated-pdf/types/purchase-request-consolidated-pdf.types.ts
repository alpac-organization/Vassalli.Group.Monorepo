import type {
	GetPurchaseRequestDetailResponse,
	PurchaseRequestProductInformation,
} from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface PurchaseRequestConsolidatedPdfProps {
	data: GetPurchaseRequestDetailResponse & {
		products: PurchaseRequestProductInformation[];
	};
}
