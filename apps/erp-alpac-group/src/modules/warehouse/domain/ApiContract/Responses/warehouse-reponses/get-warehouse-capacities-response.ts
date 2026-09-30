import type { BaseCapacities } from "../../shared/base-capacities";

export interface GetWarehouseCapacitiesResponse extends BaseCapacities {
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