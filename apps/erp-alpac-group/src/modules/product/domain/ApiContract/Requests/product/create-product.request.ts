import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { CreateProductSupplierPayload } from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export interface CreateProductRequest extends BaseRequest {
	product_name: string;
	description?: string;
	category_id: string;
	unit_measure_id: string;
	product_usage_type: ProductUsageType;
	is_tax_exempt	?: boolean;
	suppliers		?: CreateProductSupplierPayload[];
	configuration_stock ?: ConfigurationStock | null;
}

export interface ConfigurationStock {
	minimum_stock: 		   number;
	maximum_stock: 		   number;
	// weighted_average_cost: number;
}
