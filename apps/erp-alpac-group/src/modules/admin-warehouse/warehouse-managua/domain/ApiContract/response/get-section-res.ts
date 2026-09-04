import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";

export interface SectionResponse {
  section_id: string;
  section_code: string | null;
  section_name: string | null;
  section_type: string | number | null;
  storage_type: string | number | null;
  is_active: boolean;
  width_metres?: number | null;
  length_metres?: number | null;
  transform?: LayoutTransform3DDto | null;
}

export interface GetSectionsResponse {
  data: SectionResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
