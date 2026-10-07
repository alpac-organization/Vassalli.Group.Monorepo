import type { ProductSupplierTierPricePayload } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateProductSupplierPriceRequest extends BaseRequest {
	product_id: string;
	supplier_id: string;
	new_unit_price?: number;
	tier_prices?: ProductSupplierTierPricePayload[];
}
