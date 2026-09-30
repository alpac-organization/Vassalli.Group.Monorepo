export interface RackCapacityDto {
  rack_capacity_id: string;
  width: number;
  length: number;
  height: number;
  total_area_m2: number;
  available_area_with_margin_m2: number;
  unused_area_m2: number;
  occupied_chargeable_area_m2: number;
  unoccupied_chargeable_area_m2: number;
}

export interface RackCoordinatesDto {
  rack_coordinate_id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
}

export interface StockPlacementSummaryDto {
  stock_id: string;
  product_name?: string | null;
  category_name?: string | null;
  current_weight_kg: number;
  current_bultos: number;
  placed_at_date: string;
  placed_at_time: string;
}

export interface RackPositionDetailDto {
  position_id: string;
  position_code: string;
  row: number;
  column: number;
  level: number;
  status: string;
  allows_stocking: boolean;
  observations: string | null;
  current_stock: StockPlacementSummaryDto | null;
}

export interface GetRackDetailsResponse {
  rack_id: string;
  code: string;
  section_id: string;
  row_number: number;
  level_number: number;
  max_pulleys: number;
  usage_profile: string;
  status: string;
  unavailable_reason: string | null;
  status_changed_at: string | null;
  created_at: string;
  capacity: RackCapacityDto;
  coordinates: RackCoordinatesDto;
  positions: RackPositionDetailDto[];
}
