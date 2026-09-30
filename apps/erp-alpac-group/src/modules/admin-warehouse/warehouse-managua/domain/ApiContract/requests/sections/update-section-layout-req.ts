import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateSectionLayoutRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  width?: number | null;
  length?: number | null;
  position_x?: number | null;
  position_y?: number | null;
  position_z?: number | null;
  rotation_y?: number | null;
}
