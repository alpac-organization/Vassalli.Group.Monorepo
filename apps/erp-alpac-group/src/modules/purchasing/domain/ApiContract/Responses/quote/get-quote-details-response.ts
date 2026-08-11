export interface GetQuoteDetailResponse {
	quotation_id: string;
	is_active: boolean;
	has_delivery: boolean;
	has_guarantee: boolean;
	iva: number | null;
	price: number;
	price_unit: number | null;
	price_total: number;
	quote_date: string;
	brand_product: string | null;
	delivery_time: number | null;
	delivery_time_type: number | null;
	warranty_period: number | null;
	warranty_period_time_type: number | null;
	purchase_request_item_id: string;
	supplier_id: string;
	supplier_information: QuoteSupplierInformation;
}

export interface QuoteSupplierInformation {
	is_active: boolean;
	image_url: string | null;
	suppliers_legal_name: string;
	identification_number: string;
	identification_type: string;
	constitution_type: string;
}

export interface GetQuoteDetailResponseList {
	data: GetQuoteDetailResponse[];
	page_number: number;
	page_size: number;
	total: number;
}
