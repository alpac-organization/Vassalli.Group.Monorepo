import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { GetProductCategoryResponse } from "../product-category/get-product-category.response";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface GetProductResponse {
	code?: 			  string;
	product_id: 	  string;
	product_name:     string;
	description?:     string;
	category_id:      string;
	unit_measure_id?: string;
	suppliers_count?: number;
	usage_type?: 	  ProductUsageType;
	category?: 		  GetProductCategoryResponse;
}

export type GetProductResponseList = PaginateBaseResponse<GetProductResponse>