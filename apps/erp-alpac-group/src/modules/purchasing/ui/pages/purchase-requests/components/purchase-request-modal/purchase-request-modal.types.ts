import type {
	CreatePurchaseRequestPayload,
	PurchaseRequestItem,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type RequestedProductFormItem = PurchaseRequestItem & {
	product_name?: string;
};

export interface PurchaseRequestModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: () => void;
	onRequestError?: (message?: string) => void;
	onRequestSuccess?: (message: string) => void;
	currentBranchId: string;
	requestType: PurchaseRequestEnum;
}

export type PurchaseRequestEntry = {
	id: string;
	defaults: CreatePurchaseRequestPayload;
};