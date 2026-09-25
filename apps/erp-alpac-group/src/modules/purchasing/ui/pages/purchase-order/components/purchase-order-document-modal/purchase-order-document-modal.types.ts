import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface PurchaseOrderDocumentModalProps {
	isOpen: boolean;
	onClose: () => void;
	purchaseOrderId: string;
	details?: GetPurchaseOrderDetailsResponse | null;
	products?: PurchaseRequestProductInformation[];
}
