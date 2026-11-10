import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { GetProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/get-product.request";

export const SELECT_PRODUCT_PAGE_SIZE = 5;

export function buildProductListFilters(
	companyId: string,
	moduleCode: string,
	productUsageType: ProductUsageType | undefined,
	overrides?: Partial<GetProductRequest>,
): GetProductRequest {
	return {
		company_id: companyId,
		module_code: moduleCode,
		category_product_id: "",
		page_number: 1,
		page_size: SELECT_PRODUCT_PAGE_SIZE,
		...(productUsageType ? { product_usage_type: productUsageType } : {}),
		...overrides,
	};
}
