export interface WarehouseDto {
  warehouse_id: string;
  warehouse_name: string | null;
  warehouse_code: string | null;
  is_active: boolean;
  warehouse_type: string | null;
  sub_warehouses: WarehouseDto[];
}

export interface GetWarehousesResponse {
  data: WarehouseDto[];
  page_number: number;
  page_size: number;
  total: number;
}
