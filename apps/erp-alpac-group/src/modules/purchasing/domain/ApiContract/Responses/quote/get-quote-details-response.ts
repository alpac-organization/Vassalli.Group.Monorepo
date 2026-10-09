import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import type { TimeTypeValue } from "@app/core/enums/time-type.enum";
import type { ProductQualityType } from "@app/modules/purchasing/domain/enums/product-quality";

export interface GetQuoteDetailResponse {
	quotation_id: string;
	is_active: boolean;
	has_delivery: boolean;
	has_guarantee: boolean;
	inventory_available?: boolean;
	is_accepted_for_purchase?: boolean;
	is_best_option?: boolean;
	iva: number | null;
	price: number;
	price_unit: number | null;
	price_total: number;
	quote_date: string;
	brand_product: string | null;
	delivery_time: number | null;
	delivery_time_type: TimeTypeValue | number | null;
	warranty_period: number | null;
	warranty_period_time_type: TimeTypeValue | number | null;
	supplier_selection_justification?: string | null;
	supplier_rejection_justification?: string | null;
	product_quality?: ProductQualityType | null;
	payment_method_type?: PaymentMethodType | null;
	availability_time?: number | null;
	availability_time_type?: TimeTypeValue | number | null;
	additional_data?: string | null;
	supplier_product_id?: string | null;
	purchase_request_item_id: string;
	supplier_id: string;
	supplier_information: QuoteSupplierInformation;
}

export interface QuoteSupplierInformation {
	supplier_id?: string;
	is_active?: boolean;
	image_url: string | null;
	suppliers_legal_name: string;
	identification_number: string;
	identification_type: string;
	constitution_type?: string;
}

export interface GetQuoteDetailResponseList {
	data: GetQuoteDetailResponse[];
	page_number: number;
	page_size: number;
	total: number;
}
