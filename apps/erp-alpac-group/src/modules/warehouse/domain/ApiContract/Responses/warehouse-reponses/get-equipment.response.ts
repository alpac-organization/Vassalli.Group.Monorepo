import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface EquipmentDto {
  equipment_id: string;
  equipment_code: string;
  equipment_brand: string;
  equipment_model: string;
  status: string;
  type: string;
  gasoline: boolean;
  diesel: boolean;
  electric: boolean;
  lpg: boolean;
  branch_code: string;
}

export type PagedEquipmentResponse = PaginateBaseResponse<EquipmentDto>;