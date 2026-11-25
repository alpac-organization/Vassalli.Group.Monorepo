export interface OutputConsolidatedItem {
   equipment: string | null;
   stock_code: string | null;
   supply: string | null;
   quantity: number;
   total_cost: number;
   cost_center: string | null;
   customer: string | null;
}

export interface OutputConsolidatedCategory {
   category_name: string | null;
   items: OutputConsolidatedItem[];
   total_quantity: number;
   total_cost: number;
}

export interface OutputConsolidatedByEquipmentReport {
   generated_at: string;
   generated_by: string | null;
   from: string;
   to: string;
   categories: OutputConsolidatedCategory[];
}
