import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface ProductBranchInformation {
	branch_id:      string;
	branch_name:    string;
	branch_address: string;
	company_id:     string;
	company_alias:  string;
	phone_number:   string | null;
}

export interface ProductCostCenterInformation {
	cost_center_id:   string;
	cost_center_name: string;
	cost_center_code: string;
	coil_code:        number;
	description:      string | null;
}

export interface ProductUnitMeasureInformation {
	unit_measure_id: string;
	code:            string;
	name:            string;
	symbol:          string;
	description:     string | null;
	type:            string;
}

export interface ProductCategoryInformation {
	category_id: string;
	code:        string;
	name:        string;
	is_active:   boolean;
}

export interface GetProductResponse {
	product_id:                string;
	code:                      string;
	product_name:              string;
	category_id:			   string;
	unit_measure_id:		   string;
	is_tax_exempt:			   boolean;
	description:               string | null;
	usage_type:                ProductUsageType;
	suppliers_count:           number;
	branch_information:        ProductBranchInformation;
	cost_center_information:   ProductCostCenterInformation;
	unit_measure_information:  ProductUnitMeasureInformation;
	category:                  ProductCategoryInformation;
}

export type GetProductResponseList = PaginateBaseResponse<GetProductResponse>;