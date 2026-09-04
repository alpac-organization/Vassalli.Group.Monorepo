import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import type { LayoutTransform3DDto } from "./layout-transform-3d";

export interface SectionOverflowCapacityInformation {
  allows_overflow_storage: boolean;
  is_overflow_enabled: boolean;
  max_overflow_polines?: number | null;
}

export interface CreateSectionRequest extends BaseRequest {
  warehouse_id: string;
  code: string;
  name: string;
  section_type: SectionTypeValue;
  storage_type: SectionStorageTypeValue;
  width_metres: number;
  length_metres: number;
  layout_transform_3d_dto?: LayoutTransform3DDto | null;
  overflow_capacity?: SectionOverflowCapacityInformation | null;
}
