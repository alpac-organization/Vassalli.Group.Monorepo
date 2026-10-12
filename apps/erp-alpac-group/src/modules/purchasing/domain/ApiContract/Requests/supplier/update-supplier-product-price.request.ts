import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { ProductSupplierTierPricePayload } from "@app/modules/product/domain/ApiContract/shared/product-supplier";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateSupplierProductPriceRequest extends BaseRequest {
	supplier_id: string;
	product_id: string;
	new_unit_price?: number;
	currency?: CurrencyCode;
	unit_measure_id?: string | null;
	/** omit/null = don't touch; [] = delete preferential; [item] = upsert (max 1) */
	tier_prices?: ProductSupplierTierPricePayload[] | null;
}
