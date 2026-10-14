import type { GetPurchaseOrderDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";

export interface PurchaseOrderDocumentModalProps {
	isOpen: boolean;
	onClose: () => void;
	purchaseOrderId: string;
	details?: GetPurchaseOrderDetailsResponse | null;
}
