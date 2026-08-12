
export interface CreatePurchaseRequestPayload {
   company_id: string;
   module_code: string;

   area_id?: string;
   branch_id: string;
   request_date: string;
   request_type: number;
   observations: string;


   purchase_request_items: PurchaseRequestItem[];
}

export interface PurchaseRequestItem {
   quantity: number;
   quantity_unit?: number;
   product_id: string;
   unit_measure_id: string;
   description: string;
   justification?: string;
}