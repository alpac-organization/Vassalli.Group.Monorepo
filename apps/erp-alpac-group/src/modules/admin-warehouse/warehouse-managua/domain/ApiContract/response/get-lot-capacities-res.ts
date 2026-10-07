export interface LotCapacitiesResponse {
  lots_id: string;
  width: number;
  length: number;
  total_area_m2: number;
  available_area_with_margin_m2: number;
  unused_area_m2: number;
  unoccupied_chargeable_area_m2: number;
  occupied_chargeable_area_m2: number;
  percentage_available_area_with_margin_m2: number;
}
