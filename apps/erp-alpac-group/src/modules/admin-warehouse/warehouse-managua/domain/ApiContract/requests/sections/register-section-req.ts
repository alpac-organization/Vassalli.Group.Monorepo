import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterSectionRequest extends BaseRequest {
  warehouse_id: string;
  section_type: number;
  section_storage_type: number;
  width: number;
  length: number;
  maximum_number_of_pallets_per_level?: number | null;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
}
