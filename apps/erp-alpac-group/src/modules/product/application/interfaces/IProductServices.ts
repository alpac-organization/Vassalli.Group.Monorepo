import type { CreateProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/create-product-category.request";
import type { GetProductCategoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product-category/get-product-category.request";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import type { DeleteProductSupplierLinkRequest } from "@app/modules/product/domain/ApiContract/Requests/product/delete-product-supplier-link.request";
import type { GetProductDetailsRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product-details.request";
import type { GetProductSupplierPriceHistoryRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product-supplier-price-history.request";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";
import type { UpdateProductSupplierPriceRequest } from "@app/modules/product/domain/ApiContract/Requests/product/update-product-supplier-price.request";
import type { UpdateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/update-product.request";
import type { CreateProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/create-product-category.response";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { CreateProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/create-product.response";
import type { GetProductDetailsResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-details.response";
import type { GetProductSupplierPriceHistoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product-supplier-price-history.response";
import type { GetProductResponseList } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";

export interface IProductServices {
	GetProductCategories(
		payload: GetProductCategoryRequest,
	): Promise<GetProductCategoryResponse>;

	GetProducts(payload: GetProductRequest): Promise<GetProductResponseList>;

	GetProductDetails(
		payload: GetProductDetailsRequest,
	): Promise<GetProductDetailsResponse>;

	CreateProduct(payload: CreateProductRequest): Promise<CreateProductResponse>;

	UpdateProduct(payload: UpdateProductRequest): Promise<void>;

	UpdateProductSupplierPrice(
		payload: UpdateProductSupplierPriceRequest,
	): Promise<void>;

	GetProductSupplierPriceHistory(
		payload: GetProductSupplierPriceHistoryRequest,
	): Promise<GetProductSupplierPriceHistoryResponse>;

	DeleteProductSupplierLink(
		payload: DeleteProductSupplierLinkRequest,
	): Promise<void>;

	CreateProductCategory(
		payload: CreateProductCategoryRequest,
	): Promise<CreateProductCategoryResponse>;
}
