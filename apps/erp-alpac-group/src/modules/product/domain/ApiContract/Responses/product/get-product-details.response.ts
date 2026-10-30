import type { ProductLinkedSupplier } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import type { GetProductResponse } from "./get-product.response";

export interface ProductSuppliersPage {
	data:        ProductLinkedSupplier[];
	page_number: number;
	page_size:   number;
	total:       number;
}

export interface GetProductDetailsResponse extends GetProductResponse {
	suppliers: ProductSuppliersPage;
}