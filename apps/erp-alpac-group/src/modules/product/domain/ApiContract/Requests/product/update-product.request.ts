import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateProductRequest extends BaseRequest {
	product_id: string;
	product_name?: string;
	description?: string;
	category_id?: string;
	unit_measure_id?: string | null;
	product_usage_type?: ProductUsageType;
	is_tax_exempt?: boolean;
}
