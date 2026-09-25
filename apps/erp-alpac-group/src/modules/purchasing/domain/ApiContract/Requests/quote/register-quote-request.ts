import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";
export interface RegisterQuoteRequest extends BaseRequest {
	quotation_items: QuotationItem[];
}

export interface QuotationItem {
	supplier_id: string;
	purchase_request_item_id: string; 
	has_delivery: boolean;
	has_guarantee: boolean;
	iventory_available: boolean;
	price: number;
	iva?: number;
	price_unit?: number;
	brand_product?: string;
	product_quality?: ProductQualityType;
	payment_method_type?: number;
	availability_time?: number;
	availability_time_type?: number;
	delivery_time?: number;
	supplier_selection_justification?:string;
	delivery_time_type?: number;
	warranty_period?: number;
	warranty_period_time_type?: number;
};