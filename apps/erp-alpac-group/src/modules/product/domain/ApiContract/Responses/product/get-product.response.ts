import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";
import type { GetProductCategoryResponse } from "../product-category/get-product-category.response";

export interface GetProductResponse {
	product_id: 	  string;
	code?: 			  string;
	product_name: 	  string;
	description?: 	  string;
	category_id: 	  string;
	unit_measure_id?: string;
	suppliers_count?: number;
	usage_type?: 	  ProductUsageTypeEnum;
	category?: 		  GetProductCategoryResponse;
}

export interface GetProductResponseList {
	data: GetProductResponse[];
	page_number: number;
	page_size: number;
	total: number;
}
