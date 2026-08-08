import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";

export interface RegisterQuotation {
  quotation_item: QuotationItem[];
  requested_products: PurchaseRequestProductInformation[];
}

export interface QuotationItem {
  supplier_id: string;
  purchase_request_item_id: string; // Id del Producto
  has_delivery: boolean;
  has_guarantee: boolean;
  price: number;
  price_total: number;
  iva?: number;
  price_unit?: number;
  brand_product?: string;
  delivery_time?: number;
  delivery_time_type?: number;
  warranty_period?: number;
  warranty_period_time_type?: number;
};