import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { SupplierPriceHistoryType } from "@app/core/enums/supplier-price-history-type.enum";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export type ProductSupplierPriceHistoryStatus =
	| "Current"
	| "Scheduled"
	| "Historical";

export interface ProductSupplierPriceHistoryItem {
	price_type: SupplierPriceHistoryType;
	price: number;
	currency?: CurrencyCode;
	min_quantity?: number | null;
	effective_from: string;
	effective_to?: string | null;
	status?: ProductSupplierPriceHistoryStatus;
	is_current: boolean;
}

export type ProductSupplierPriceHistoryPage = PaginateBaseResponse<
	ProductSupplierPriceHistoryItem[]
>;

export type GetProductSupplierPriceHistoryResponse =
	ProductSupplierPriceHistoryPage;
