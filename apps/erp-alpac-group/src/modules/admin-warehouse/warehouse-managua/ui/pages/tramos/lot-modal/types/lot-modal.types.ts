import type { CreateLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { SpatialDraft } from "@app/modules/admin-warehouse/warehouse-managua/ui/components/layout-builder-2d/layout-builder-2d";

export interface LotModalProps {
  isOpen: boolean;
  sectionId: string;
  spatialDraft?: SpatialDraft | null;
  onClose: () => void;
  onSubmit?: (data: CreateLotsRequest) => void;
}

export type FormValues = {
  code: string;
  width_metres?: string;
  length_metres?: string;
  nominal_rows?: string;
  nominal_columns?: string;
  allows_stacking: boolean;
  status: number;
  unavailable_reason?: string;
};
