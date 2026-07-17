export interface GetHistoryQuotes {
  made_by: string;
  quote_date: string;
  approximate_cost: number;
  observations: string;
  additional_data: AdditionalDataForQuote;
}

export interface AdditionalDataForQuote {
  quotes_made: Quotes[];
}

export interface Quotes {
  suppliers_details: SuppliersDetails;
  product_details_quotes: ProductDetailsQuotes[];
}

export interface SuppliersDetails {
  its_registered: boolean;
  supplier_id?: string | null;
  supplier_legal_name: string;
  contact_name: string;
  contact_phone_number: string;
}

export interface ProductDetailsQuotes {
  product_name: string;
  product_cost: number;
  unit_measure_id: string;
  observations?: string | null;
  images_base_64?: string[];
}
