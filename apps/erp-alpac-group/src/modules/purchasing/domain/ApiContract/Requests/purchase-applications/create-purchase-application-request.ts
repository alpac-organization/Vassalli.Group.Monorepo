
export interface CreatePurchaseApplicationRequest {
   branch_id: string;
   request_date: string;
   request_type: number;
   justification: string;
   requested_products: RequestedProduct[];
}

export interface RequestedProduct {
   quantity: number;
   quantity_unit?: number;   
   unit_measure_id: string;
   product_id: string;
   justification?: string;
}