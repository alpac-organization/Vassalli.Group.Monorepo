import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { CreateProductSupplierPayload } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateProductRequest extends BaseRequest {
	product_name: string;
	description?: string;
	category_id: string;
	unit_measure_id: string;
	product_usage_type: ProductUsageType;
	is_tax_exempt?: boolean;
	suppliers?: CreateProductSupplierPayload[];
}
