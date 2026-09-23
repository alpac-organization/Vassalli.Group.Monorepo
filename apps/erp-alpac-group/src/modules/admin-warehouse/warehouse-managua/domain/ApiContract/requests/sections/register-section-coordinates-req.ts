import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterSectionCoordinatesRequest extends BaseRequest {
  warehouse_id: string;
  section_id: string;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
}
