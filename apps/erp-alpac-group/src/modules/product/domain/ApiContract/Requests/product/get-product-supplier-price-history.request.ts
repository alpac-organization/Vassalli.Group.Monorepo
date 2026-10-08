import type { SupplierPriceHistoryType } from "@app/core/enums/supplier-price-history-type.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetProductSupplierPriceHistoryRequest extends BaseRequest {
	product_id: string;
	supplier_id: string;
	page_number?: number;
	page_size?: number;
	price_type?: SupplierPriceHistoryType;
}
