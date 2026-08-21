import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface SectionOverflowCapacityInformation {
  allows_overflow_storage: boolean;
  is_overflow_enabled: boolean;
  max_overflow_polines?: number | null;
}

export interface CreateSectionRequest extends BaseRequest {
  warehouse_id: string;
  code: string;
  name: string;
  section_type: string;
  storage_type: string;
  width_metres: number;
  length_metres: number;
  overflow_capacity?: SectionOverflowCapacityInformation | null;
}
