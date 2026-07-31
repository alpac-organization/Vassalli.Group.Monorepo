import type {
	CreatePurchaseApplicationRequest,
	RequestedProduct,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase-applications/create-purchase-application-request";
import type { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type RequestedProductFormItem = RequestedProduct & {
	description?: string;
};

export type CreatePurchaseRequestFormValues = {
	request_date: string;
	justification: string;
	requested_products: RequestedProductFormItem[];
};

export interface PurchaseRequestModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: CreatePurchaseApplicationRequest) => void;
	onRequestError?: (message?: string) => void;
	onRequestSuccess?: (message?: string) => void;
	currentBranchId: string;
	requestType: PurchaseRequestEnum;
}
