import type {	
	RequestedProduct,
} from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";
import type { PurchaseRequestEnum } from "@app/modules/purchasing/domain/enums/purchase-request.enum";

export type RequestedProductFormItem = Omit<
	RequestedProduct,
	"quantity" | "quantity_unit"
> & {
	description?: string;
	quantity: number | "";
	quantity_unit?: number | "";
};

export type CreatePurchaseRequestFormValues = {
	area_id: string;	
	justification: string;
	requested_products: RequestedProductFormItem[];
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
