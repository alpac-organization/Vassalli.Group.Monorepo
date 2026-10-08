import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { SupplierExclusiveStatus } from "@app/core/enums/supplier-exclusive-status.enum";

export interface ProductSupplierTierPricePayload {
	min_quantity: number;
	preferential_price: number;
	valid_from: string;
	valid_to?: string | null;
	unit_measure_id?: string | null;
}

export interface ProductSupplierTierPrice extends ProductSupplierTierPricePayload {
	tier_price_id: string;
}

export interface CreateProductSupplierPayload {
	supplier_id: string;
	unit_price: number;
	currency: CurrencyCode;
	tier_prices?: ProductSupplierTierPricePayload[];
}

export interface ProductLinkedSupplier {
	supplier_product_id?: string;
	supplier_id: string;
	supplier_legal_name?: string;
	commercial_name?: string | null;
	identification_number?: string | null;
	exclusive_status?: SupplierExclusiveStatus | null;
	unit_price: number;
	currency: CurrencyCode;
	last_price_update?: string;
	is_active?: boolean;
	tier_prices: ProductSupplierTierPrice[];
}
