import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface SectionDto {
  section_id: string;
  section_code: string | null;
  section_type: SectionTypeValue | null;
  section_storage_type: SectionStorageTypeValue | null;
  is_active: boolean;
  width: number | null;
  length: number | null;
  total_area: number | null;
  available_area: number | null;
  percentage_available_area: number | null;
  position_x: number | null;
  position_y: number | null;
  position_z: number | null;
  rotation_y: number | null;
}

export type GetSectionsResponse = PaginateBaseResponse<SectionDto[]>;
