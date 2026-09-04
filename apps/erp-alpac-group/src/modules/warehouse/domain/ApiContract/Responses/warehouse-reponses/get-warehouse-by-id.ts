import type {
  Capacity,
  WarehouseDto,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

export interface WarehouseDetailsDto {
  width_metres: number;
  length_metres: number;
  ramps_count?: number | null;
  parking_spaces_count?: number | null;
}

export interface SectionSummaryDto {
  section_id: string;
  code: string;
  name: string;
  section_type: string | number | null;
  storage_type: string | number | null;
  is_active: boolean;
  width_metres: number;
  length_metres: number;
  usable_area_m2?: number | null;
  occupied_area_m2?: number | null;
  free_area_m2?: number | null;
  occupancy_percentage?: number | null;
  racks_count: number;
  lots_count: number;
  total_positions: number;
  occupied_positions: number;
  free_positions: number;
  blocked_positions: number;
}

export interface WarehouseDetailResponse extends WarehouseDto {
  details: WarehouseDetailsDto;
  sections: SectionSummaryDto[];
  total_racks: number;
  total_lots: number;
  total_positions: number;
  occupied_positions: number;
  free_positions: number;
  blocked_positions: number;
  capacity: Capacity;
}
