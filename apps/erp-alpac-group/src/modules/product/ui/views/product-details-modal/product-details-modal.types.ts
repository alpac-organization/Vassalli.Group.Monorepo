import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface ProductDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedProduct: GetProductResponse | null;
}
