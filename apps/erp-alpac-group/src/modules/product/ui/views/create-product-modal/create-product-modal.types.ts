import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface CreatedProductDto {
	data: CreateProductResponse;
	product_name: string;
	category_name: string;
}

export interface CreateProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedProduct?: GetProductResponse | null;
	onSubmit?: (data: CreatedProductDto) => void;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
