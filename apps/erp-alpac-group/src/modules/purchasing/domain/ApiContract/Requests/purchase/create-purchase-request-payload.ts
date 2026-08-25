import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface PurchaseRequestMainPayload extends BaseRequest {
   purchase_requests: CreatePurchaseRequestPayload[];
}

export interface CreatePurchaseRequestPayload {
   area_id?: string;
   branch_id: string;
   service_order_id?: string;
   observations: string;
   priority_level?: number;
   destination: number;
   request_type: number;
   purchase_request_items: PurchaseRequestItem[];
}

export interface PurchaseRequestItemAdditionalData {
   images_product_to_changed?: string[];
}

export interface PurchaseRequestItem {
   quantity: number;
   quantity_unit?: number | null;
   product_id: string;
   product_name?: string | null;
   unit_measure_id: string;
   description: string;
   justification?: string;
   additional_data?: string | null;
   images?: PurchaseRequestItemAdditionalData;
}
