import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface  DeleteProductModalProps {
    readonly isOpen : boolean;
    readonly onClose: () => void;
    readonly productSelected: GetProductResponse | null;
	onRequestError?:   (message?: string) => void;
    onRequestSuccess?: (message: string) => void;
}