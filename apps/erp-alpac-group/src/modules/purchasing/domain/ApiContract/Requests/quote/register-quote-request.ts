export interface RegisterQuotationRequest {
   quotation_items: QuotationItem[];
 }
 
 export interface QuotationItem {
   supplier_id: string;
   purchase_request_item_id: string; // Id del item de la solicitud de compra
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