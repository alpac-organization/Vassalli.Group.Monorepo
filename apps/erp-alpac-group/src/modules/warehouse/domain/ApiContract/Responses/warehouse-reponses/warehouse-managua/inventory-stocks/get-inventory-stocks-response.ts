export interface InventoryStockProductInformation {
  product_id: string;
  product_code?: string | null;
  product_name?: string | null;
  description?: string | null;
  product_usage_type?: number | null;
}

export interface InventoryStockDto {
  product_stock_id: string;
  available_quantity: number;
  status: number;
  product_information?: InventoryStockProductInformation | null;
}

export interface GetInventoryStocksResponse {
  data: InventoryStockDto[];
  page_number: number;
  page_size: number;
  total: number;
  in_minimum_stock: number;
}
