import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type {
	ProductSupplierTierPrice,
	ProductSupplierTierPricePayload,
} from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export interface CreateSupplierProductPayload {
	product_id: string;
	unit_price: number;
	currency: CurrencyCode;
	tier_prices?: ProductSupplierTierPricePayload[];
}

export interface SupplierLinkedProduct {
	product_id: string;
	code: string;
	product_name: string;
	unit_measure_id: string;
	unit_price: number;
	currency: CurrencyCode;
	last_price_update?: string;
	tier_prices: ProductSupplierTierPrice[];
}
