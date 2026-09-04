import type { SectionTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";

export interface SectionDto {
  section_id: string;
  section_code: string | null;
  section_name: string | null;
  section_type: SectionTypeValue | null;
  storage_type: SectionStorageTypeValue | null;
  is_active: boolean;
  width_metres: number;
  length_metres: number;
  transform: LayoutTransform3DDto | null;
  total_area_m2: number;
  used_area_m2: number;
  total_positions: number;
  used_positions: number;
}
