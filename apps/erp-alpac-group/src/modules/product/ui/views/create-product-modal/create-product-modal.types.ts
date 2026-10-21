import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type { NewPurchaseRequestProduct } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";

export interface CreatedProductDto {
	data: CreateProductResponse;
	product_name: string;
	category_name: string;
}

export interface DraftProductDto {
	new_product: NewPurchaseRequestProduct;
	product_name: string;
	category_name: string;
}

export type CreateProductModalMode = "persist" | "draft";

export interface CreateProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedProduct?: GetProductResponse | null;
	mode?: CreateProductModalMode;
	onSubmit?: (data: CreatedProductDto) => void;
	onDraftSubmit?: (data: DraftProductDto) => void;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}
