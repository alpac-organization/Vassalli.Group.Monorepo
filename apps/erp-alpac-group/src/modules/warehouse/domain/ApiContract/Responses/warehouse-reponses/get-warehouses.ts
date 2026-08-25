export interface WarehouseDto {
  warehouse_id: string;
  warehouse_name: string | null;
  warehouse_code: string | null;
  is_active: boolean;
  warehouse_type: string | null;
  has_children: boolean;
  sections_count: number;
  is_owner: boolean;
  capacity: Capacity;
}

export interface GetWarehousesResponse {
  data: WarehouseDto[];
  page_number: number;
  page_size: number;
  total: number;
}

export interface Capacity {
  total_area_m2: number;
  usable_area_m2?: number | null;
  unusable_area_m2?: number | null;
  occupied_area_m2?: number | null;
  free_area_m2?: number | null;
  occupancy_percentage?: number | null;
  last_calculated_at?: string | null;
}
