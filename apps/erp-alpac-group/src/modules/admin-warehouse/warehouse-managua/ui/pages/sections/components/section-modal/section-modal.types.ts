import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";

export interface SectionModalProps {
  isOpen: boolean;
  spatialDraft?: SpatialDraft | null;
  defaultStorageType?: SectionStorageTypeValue;
  onClose: () => void;
  onSubmit?: (data: FormValues) => void;
}

export type FormValues = {
  code: string;
  name: string;
  section_type: number;
  storage_type: number;
  width_metres?: number;
  length_metres?: number;
  is_elevated: boolean;
  position_y_metres?: number;
  overflow: {
    allows_overflow_storage: boolean;
    is_overflow_enabled: boolean;
    max_overflow_polines?: number;
  };
};
