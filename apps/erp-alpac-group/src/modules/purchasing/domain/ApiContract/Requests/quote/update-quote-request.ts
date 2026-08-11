import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateQuoteRequest extends BaseRequest {
  quotation_id: string;
  supplier_id?: string;
  has_delivery?: boolean;
  has_guarantee?: boolean;
  iva?: number;
  price?: number;
  price_unit?: number;
  brand_product?: string;
  delivery_time?: number;
  warranty_period?: number;
  delivery_time_type?: number;
  warranty_period_time_type?: number;
}
