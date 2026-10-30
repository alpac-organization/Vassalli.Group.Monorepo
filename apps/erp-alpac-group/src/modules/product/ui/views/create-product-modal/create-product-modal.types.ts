import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";
import type { GetProductDetailsResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-details.response";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type { CatalogLinkItemForm } from "../../components/catalog-link-editor/catalog-link-editor.types";

export interface CreatedProductDto {
	data: CreateProductResponse;
	product_name: string;
	category_name: string;
}

export interface CreateProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	typeProductToRegister: ProductUsageType;
	selectedProduct?: GetProductResponse | null;
	onSubmit?: (data: CreatedProductDto) => void;
	onRequestSuccess?: (message: string) => void;
	onRequestError?: (message?: string) => void;
}

export type CreateProductDraftSource = {
	isOpen: boolean;
	isEditMode: boolean;
	productDetails?: GetProductDetailsResponse;
	companyId: string;
	moduleCode: string;
   	usageType: ProductUsageType;
};

export type CreateProductDraft = {
	formValues: CreateProductRequest;
	supplierLinks: CatalogLinkItemForm[];
	categoryName: string;
};