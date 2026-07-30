export type CreateQuote = {
  branch_id: string;
  quote_date: string;
  observations: string;
  quote_details: QuoteDetails[];
};

export type QuoteDetails = {
  product_id: string;
  suppliers: Supplier[];
};

export type Supplier = {
  supplier_id: string;  
  is_wholesale: boolean;
  quantity: number;
  quantity_per_unit: number;
  price: number;
  supplier_legal_name: string;
  additional_data: AdditionalData[];
};

export type AdditionalData = {
  brand: string;
  images_base64: string[];
  warranty_information: WarrantyInformation;
};

export type WarrantyInformation = {
  has_warranty: boolean;
  quantity_days: number;
  quantity_months: number;
};
