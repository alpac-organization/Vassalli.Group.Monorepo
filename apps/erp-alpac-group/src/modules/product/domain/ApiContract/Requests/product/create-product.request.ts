import type { ProductUsageTypeEnum } from "@app/core/enums/product-usage-type.enum";
import type { CreateProductSupplierPayload } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateProductRequest extends BaseRequest {
	product_name: 		 string;
	description?: 		 string;
	category_id: 		 string;
	unit_measure_id: 	 string;
	is_tax_exempt?: 	 boolean;
	product_usage_type:  ProductUsageTypeEnum;
	suppliers?: 		 CreateProductSupplierPayload[];
	configuration_stock: ConfigurationStockToInventory | null;
}

export interface ConfigurationStockToInventory {
	minimum_stock:         number;
	maximum_stock:         number;
	available_quantity:    number | null;
	weighted_average_cost: number | null;
}