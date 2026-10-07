import type {
	ProductSupplierTierPrice,
	ProductSupplierTierPricePayload,
} from "@app/modules/product/domain/ApiContract/shared/product-supplier";

export interface CreateSupplierProductPayload {
	product_id: string;
	unit_price: number;
	tier_prices?: ProductSupplierTierPricePayload[];
}

export interface SupplierLinkedProduct {
	product_id: string;
	code: string;
	product_name: string;
	unit_measure_id: string;
	unit_price: number;
	last_price_update?: string;
	tier_prices: ProductSupplierTierPrice[];
}
