import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export type CreateQuote = {
  branch_id: string;
  quote_date: string;
  observations: string;
  requested_products: RequestedProduct[];
};

export type RequestedProduct = PurchaseRequestProductInformation & {
  suppliers: Supplier[];
}

export type Supplier = {
  supplier_id: string;  
  supplier_legal_name: string;
  is_wholesale: boolean;  
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
