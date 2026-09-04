import type { LayoutTransform3DDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/layout-transform-3d";

export interface SectionResponse {
  section_id: string;
  section_code: string | null;
  section_name: string | null;
  section_type: string | number | null;
  storage_type: string | number | null;
  is_active: boolean;
  width_metres?: number | string | null;
  length_metres?: number | string | null;
  /** Flat pose fields some list payloads may return */
  position_x?: number | string | null;
  position_y?: number | string | null;
  position_z?: number | string | null;
  rotation_y?: number | string | null;
  /** Canonical spatial pose from GET responses */
  transform?: LayoutTransform3DDto | null;
  /** Alternate keys some API versions may return */
  layout_transform_3d?: LayoutTransform3DDto | null;
  layout_transform_3d_dto?: LayoutTransform3DDto | null;
}

export interface GetSectionsResponse {
  data: SectionResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
