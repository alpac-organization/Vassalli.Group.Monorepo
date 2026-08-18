export interface CreatePurchaseRequestPayload {
   company_id: string;
   module_code: string;
   area_id?: string;
   cost_center_id: string;
   branch_id: string;   
   request_type: number;
   priority_level?: number;
   destination: number;
   observations: string;
   purchase_request_items: PurchaseRequestItem[];
}

export interface PurchaseRequestItemAdditionalData {
   images_product_to_changed?: string[];
}

export interface PurchaseRequestItem {
   quantity: number;
   quantity_unit?: number | null;
   product_id: string;
   unit_measure_id: string;
   description: string;
   justification?: string;
   additional_data?: string | null;
}
