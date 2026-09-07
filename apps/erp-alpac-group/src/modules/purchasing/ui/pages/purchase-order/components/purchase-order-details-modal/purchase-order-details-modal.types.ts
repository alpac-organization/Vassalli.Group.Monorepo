import type { GetPurchaseOrdersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-orders-response";

export interface PurchaseOrderDetailsProps {
	isOpen: boolean;
	onClose: () => void;
	purchaseOrder: GetPurchaseOrdersResponse | null;
}
