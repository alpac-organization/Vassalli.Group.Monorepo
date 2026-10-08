import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface ProductSuppliersModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedProduct: GetProductResponse | null;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
