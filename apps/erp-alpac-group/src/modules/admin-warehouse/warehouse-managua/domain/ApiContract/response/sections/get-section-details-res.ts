export interface SectionCapacityDto {
  section_capacity_id: string;
  width: number;
  length: number;
  unused_area_m2: number;
  available_area_with_margin_m2: number;
  total_area_m2: number;
  unoccupied_chargeable_area_m2: number;
  occupied_chargeable_area_m2: number;
  percentage_available_area_with_margin_m2: number;
}

export interface SectionCoordinatesDto {
  section_coordinate_id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
}

export interface WarehouseSummaryDto {
  warehouse_id: string;
  code: string;
  is_active: boolean;
  warehouse_type: number | null;
}

export interface GetSectionDetailsResponse {
  section_id: string;
  section_code: string | null;
  is_active: boolean;
  capacity: SectionCapacityDto;
  coordinates: SectionCoordinatesDto;
  warehouse: WarehouseSummaryDto;
}
