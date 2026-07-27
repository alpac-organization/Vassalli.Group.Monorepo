export type ProductQuoteFormValues = {
	client_id: string;
	product_id: string;
	product_name: string;
	product_cost: number;
	unit_measure_id: string;
	observations: string;
	images_base_64: string[];
};

export type QuoteDetails = {
	is_new_product: boolean;
	is_new_supplier: boolean;
	amount: number;
	product_id: string;
	supplier_id: string;
	unit_measure_id: string;
	additional_data: {
		quantity?: number;
	};
};

export type CreateQuoteFormValues = {
	// area_id: string;
	branch_id: string;
	quote_date: string;
	observations: string;
	application_codes: string[];
	products: CatalogProductOption[];
	quote_details: QuoteDetails[];
};

export type CatalogProductOption = {
	product_id: string;
	product_name: string;
	product_cost?: number;
	quantity: number;
	unit_measure_id: string;
	unit_measure_name: string;
};