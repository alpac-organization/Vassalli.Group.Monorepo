import type { IHttpHandler } from "@app/core/ports";
import { cleanParams } from "@app/shared/utils/object.utils";
import { normalizePagedList } from "@app/shared/utils/paged-response.utils";
import type { IProductServices } from "@app/modules/product/application/interfaces/IProductServices";
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

export class ProductServices implements IProductServices {
	private readonly apiHandler: IHttpHandler;

	constructor(httpHandler: IHttpHandler) {
		this.apiHandler = httpHandler;
	}

	async GetProductCategories(
		payload: GetProductCategoryRequest,
	): Promise<GetProductCategoryResponse> {
		const { company_id, module_code, ...queryParams } = payload;
		const url = `companies/${company_id}/modules/${module_code}/category-products`;

		return this.apiHandler.get<GetProductCategoryResponse>(url, {
			params: cleanParams(queryParams),
		});
	}

	async GetProducts(payload: GetProductRequest): Promise<GetProductResponseList> {
		const { company_id, module_code, ...queryParams } = payload;
		const url = `companies/${company_id}/modules/${module_code}/products`;

		return this.apiHandler.get<GetProductResponseList>(url, {
			params: cleanParams(queryParams),
		});
	}

	async GetProductDetails(
		payload: GetProductDetailsRequest,
	): Promise<GetProductDetailsResponse> {
		const { company_id, module_code, product_id, ...queryParams } = payload;
		const url = `companies/${company_id}/modules/${module_code}/products/${product_id}`;

		const response = await this.apiHandler.get<GetProductDetailsResponse>(url, {
			params: cleanParams(queryParams),
		});

		if (!response.suppliers) return response;

		return {
			...response,
			suppliers: normalizePagedList(response.suppliers),
		};
	}

	async CreateProduct(
		payload: CreateProductRequest,
	): Promise<CreateProductResponse> {
		const { company_id, module_code, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/products`;

		return this.apiHandler.post<CreateProductResponse>(url, rest);
	}

	async UpdateProduct(payload: UpdateProductRequest): Promise<void> {
		const { company_id, module_code, product_id, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/products/${product_id}`;

		await this.apiHandler.patch<void>(url, rest);
	}

	async UpdateProductSupplierPrice(
		payload: UpdateProductSupplierPriceRequest,
	): Promise<void> {
		const { company_id, module_code, product_id, supplier_id, ...rest } =
			payload;
		const url = `companies/${company_id}/modules/${module_code}/products/${product_id}/suppliers/${supplier_id}/prices`;

		await this.apiHandler.patch<void>(url, rest);
	}

	async GetProductSupplierPriceHistory(
		payload: GetProductSupplierPriceHistoryRequest,
	): Promise<GetProductSupplierPriceHistoryResponse> {
		const { company_id, module_code, product_id, supplier_id, ...queryParams } =
			payload;
		const url = `companies/${company_id}/modules/${module_code}/products/${product_id}/suppliers/${supplier_id}/price-history`;

		return this.apiHandler.get<GetProductSupplierPriceHistoryResponse>(url, {
			params: cleanParams(queryParams),
		});
	}

	async DeleteProductSupplierLink(
		payload: DeleteProductSupplierLinkRequest,
	): Promise<void> {
		const { company_id, module_code, product_id, supplier_id } = payload;
		const url = `companies/${company_id}/modules/${module_code}/products/${product_id}/suppliers/${supplier_id}`;

		await this.apiHandler.delete<void>(url);
	}

	async CreateProductCategory(
		payload: CreateProductCategoryRequest,
	): Promise<CreateProductCategoryResponse> {
		const { company_id, module_code, ...rest } = payload;
		const url = `companies/${company_id}/modules/${module_code}/category-products`;

		return this.apiHandler.post<CreateProductCategoryResponse>(url, rest);
	}
}
