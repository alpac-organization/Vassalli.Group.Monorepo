export type ProductQuoteFormValues = {
	client_id: string;
	product_id: string;
	product_name: string;
	product_cost: number;
	unit_measure_id: string;
	observations: string;
	images_base_64: string[];
};

export type CreateQuote = {	
	branch_id: string;
	quote_date: string;
	observations: string;	
	quote_details: QuoteDetails[];
};

export type QuoteDetails = {
	supplier_id: string;
	products: Products[]
};

export type Products = {
	product_id: string;
	unit_of_measure_id: string;
	is_wholesale: boolean;
	quantity: number;
	quantity_per_unit: number;
	price: number;
	additional_data: []	
};

export type AdditionalData = {
	brand: string;
	images_base64: string[],
	warranty_information: WarrantyInformation
}

export type WarrantyInformation = {
	has_warranty: boolean;
	quantity_days: number;
	quantity_months: number;
}