export interface StockDailyProduct {
   product_code: string | null;
   product_name: string | null;
   product_description: string | null;
   inventory_stock: number;
   unit_measure: string | null;
   minimum_stock: number;
   maximum_stock: number | null;
   stock_status: string | null;
}

export interface StockDailyUsageType {
   usage_type: string | null;
   products: StockDailyProduct[];
}

export interface StockDailyCostCenter {
   cost_center_id: string;
   cost_center_name: string | null;
   product_count: number;
   out_of_stock_count: number;
   below_minimum_count: number;
   normal_count: number;
   over_maximum_count: number;
   usage_types: StockDailyUsageType[];
}

export interface StockDailyArea {
   area_id: string;
   area_name: string | null;
   cost_centers: StockDailyCostCenter[];
}

export interface StockDailyBranch {
   branch_id: string;
   branch_name: string | null;
   areas: StockDailyArea[];
}

export interface StockDailyReport {
   generated_at: string;
   generated_by: string | null;
   generated_by_user_name: string | null;
   total_products: number;
   out_of_stock_count: number;
   below_minimum_count: number;
   normal_count: number;
   over_maximum_count: number;
   branches: StockDailyBranch[];
}