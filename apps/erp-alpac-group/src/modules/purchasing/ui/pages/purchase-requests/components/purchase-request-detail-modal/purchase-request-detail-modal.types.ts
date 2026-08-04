import type { GetPurchaseRequestResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-response";

export interface PurchaseRequestDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	purchaseRequest: GetPurchaseRequestResponse | null;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
