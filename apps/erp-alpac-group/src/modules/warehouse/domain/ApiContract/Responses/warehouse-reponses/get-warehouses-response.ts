export interface WarehouseDto {
  warehouse_id: string;
  code: string;
  is_active: boolean;
  warehouse_type: string | null;
}

export interface GetWarehousesResponse {
  data: WarehouseDto[];
  page_number: number;
  page_size: number;
  total: number;
}
