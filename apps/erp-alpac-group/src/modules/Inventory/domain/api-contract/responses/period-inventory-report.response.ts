export interface PeriodInventoryItem {
   stock_code: string | null;
   product_name: string | null;
   initial_quantity: number;
   initial_cost: number;
   initial_total: number;
   entry_quantity: number;
   entry_total_cost: number;
   exit_quantity: number;
   exit_total_cost: number;
   final_quantity: number;
   final_cost: number;
   final_total: number;
}

export interface PeriodInventoryReport {
   generated_at: string;
   generated_by: string | null;
   from: string;
   to: string;
   items: PeriodInventoryItem[];
   total_initial_total: number;
   total_entry_total_cost: number;
   total_exit_total_cost: number;
   total_final_total: number;
}
