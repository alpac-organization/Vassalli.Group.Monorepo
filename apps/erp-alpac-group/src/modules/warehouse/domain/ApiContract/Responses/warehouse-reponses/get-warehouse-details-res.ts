export interface WarehouseLocationDto {
  location_name: string;
}

export interface WarehouseCapacityDto {
  width: number;
  length: number;
  has_margins: boolean;
  minimum_height: number;
  maximum_height: number;
  margin_top: number;
  margin_bottom: number;
  margin_left: number;
  margin_right: number;
  total_area_m2: number;
  unused_area_m2: number;
  available_area_with_margin_m2: number;
  occupied_chargeable_area_m2: number;
  unoccupied_chargeable_area_m2: number;
  percentage_available_area_with_margin_m2: number;
  total_volumen_m3: number;
  unused_volumen_m3: number;
  available_volumen_with_margin_m3: number;
  occupied_chargeable_volumen_m3: number;
  unoccupied_chargeable_volumen_m3: number;
  percentage_available_volumen_with_margin_m3: number;
}

export interface GetWarehouseDetailsResponse {
  warehouse_id: string;
  code: string;
  is_active: boolean;
  warehouse_type: string | null;
  location: WarehouseLocationDto | null;
  capacity: WarehouseCapacityDto | null;
}
