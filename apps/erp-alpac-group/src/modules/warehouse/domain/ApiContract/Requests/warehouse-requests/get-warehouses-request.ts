export interface GetWarehouseRequest {
  company_id: string;
  module_code: string;
  branch_code?: string;
  warehouse_code?: string;
  warehouse_type?: number;
  is_active?: boolean;
  page_number?: number;
  page_size?: number;
}
