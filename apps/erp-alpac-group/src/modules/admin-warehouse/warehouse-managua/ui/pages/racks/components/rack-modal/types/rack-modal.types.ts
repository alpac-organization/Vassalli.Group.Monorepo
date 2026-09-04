import type { SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";

export interface RackModalProps {
  isOpen: boolean;
  spatialDraft?: SpatialDraft | null;
  onClose: () => void;
  onSubmit?: (data: FormValues) => void;
}

export type RackLevelFormValues = {
  level_number?: string;
  width_metres?: string;
  length_metres?: string;
  usage_profile: number;
  max_pulleys?: string;
  status: number;
  unavailable_reason?: string;
};

export type FormValues = {
  shelf_code: string;
  rack_count?: string;
  levels: RackLevelFormValues[];
};
