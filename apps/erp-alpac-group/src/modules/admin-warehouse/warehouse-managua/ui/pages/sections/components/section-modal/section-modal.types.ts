import type { CreateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-section-req";

export interface SectionModalProps {
  isOpen: boolean;
  warehouseId: string;
  onClose: () => void;
  onSubmit?: (data: CreateSectionRequest) => void;
}

export type FormValues = {
  code: string;
  name: string;
  section_type: number;
  storage_type: number;
  width_metres?: number;
  length_metres?: number;
  overflow: {
    allows_overflow_storage: boolean;
    is_overflow_enabled: boolean;
    max_overflow_polines?: number;
  };
};
