import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface SectionDto {
  section_id: string;
  section_code: string | null;
  section_type: number | null;
  section_storage_type: number | null;
  is_active: boolean;
}

export type GetSectionsResponse = PaginateBaseResponse<SectionDto[]>;