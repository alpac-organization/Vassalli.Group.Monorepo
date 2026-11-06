import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { ProductLinkedSupplier } from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export type ProductSuppliersPage = {
	data?: ProductLinkedSupplier[];
	items?: ProductLinkedSupplier[];
	page_number: number;
	page_size: number;
	total?: number;
	total_count?: number;
};

export interface GetProductDetailsResponse {
	product_id: string;
	code: string;
	product_name: string;
	description?: string;
	category_id: string;
	category?: GetProductCategoryResponse;
	unit_measure_id: string;
	unit_measure_name?: string;
	product_usage_type?: ProductUsageType;
	is_tax_exempt?: boolean;
	suppliers?: ProductSuppliersPage;
}
