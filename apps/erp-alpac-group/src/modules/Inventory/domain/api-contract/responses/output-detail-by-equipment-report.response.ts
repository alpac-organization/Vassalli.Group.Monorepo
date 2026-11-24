export interface OutputDetailByEquipmentItem {
   output_code: string | null;
   request_code: string | null;
   equipment: string | null;
   category: string | null;
   output_date: string;
   stock_code: string | null;
   supply: string | null;
   quantity: number;
   cost: number;
   total_cost: number;
   cost_center: string | null;
   service_order_code: string | null;
   customer: string | null;
}

export interface OutputDetailByEquipmentReport {
   generated_at: string;
   generated_by: string | null;
   from: string;
   to: string;
   items: OutputDetailByEquipmentItem[];
   total_quantity: number;
   total_cost: number;
   total_total_cost: number;
}
