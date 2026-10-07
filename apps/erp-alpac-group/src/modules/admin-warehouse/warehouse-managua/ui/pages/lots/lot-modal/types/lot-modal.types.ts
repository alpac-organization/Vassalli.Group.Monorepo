import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";
import type { DispersionAxis } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/utils/lot-placement.utils";

export const AXIS_OPTIONS = [
	{ value: "X", label: "Eje X (Horizontal)" },
	{ value: "Y", label: "Eje Y (Vertical)" },
];

export interface LotModalProps {
  isOpen: boolean;
  warehouseId: string;
  sectionId: string;
  /** Ancho de la sección en metros (para dispersión y validación). */
  sectionWidth?: number;
  /** Largo de la sección en metros (para dispersión y validación). */
  sectionLength?: number;
  onClose: () => void;
  onSubmit?: (data: RegisterLotRequest) => void;
}

export type LotFormValues = {
  quantity?: string | number;
  nominal_rows?: string | number;
  nominal_columns?: string | number;
  width?: string | number;
  length?: string | number;
  disperse_axis: DispersionAxis;
};
