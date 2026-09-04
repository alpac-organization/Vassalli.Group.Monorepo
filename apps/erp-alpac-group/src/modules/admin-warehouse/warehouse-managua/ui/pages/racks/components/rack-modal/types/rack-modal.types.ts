import type { CreateRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-racks-req";
import type { SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";

export interface RackModalProps {
  isOpen: boolean;
  sectionId: string;
  spatialDraft?: SpatialDraft | null;
  onClose: () => void;
  onSubmit?: (data: CreateRacksRequest) => void;
}

export type RackLevelFormValues = {
  level_number?: string;
  width_metres?: string;
  length_metres?: string;
  height_metres?: string;
  usage_profile: number;
  max_pulleys?: string;
  status: number;
  unavailable_reason?: string;
};

export type FormValues = {
  shelf_code: string;
  levels: RackLevelFormValues[];
};
