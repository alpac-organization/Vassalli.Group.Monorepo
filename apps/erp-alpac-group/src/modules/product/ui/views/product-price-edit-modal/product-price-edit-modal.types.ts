import type { ProductLinkedSupplier } from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export interface ProductPriceEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	productId: string;
	supplier: ProductLinkedSupplier | null;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
