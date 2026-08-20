
export interface GetWarehouseRequest {
   company_id: string;
   module_code: string;
   code?: string;
   warehouse_name?: string;
   warehouse_type?: string;
   is_active?: boolean;
   page_number?: number;
   page_size?: number;
}