import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

export interface LotModalProps {
  isOpen: boolean;
  warehouseId: string;
  sectionId: string;
  onClose: () => void;
  onSubmit?: (data: RegisterLotRequest) => void;
}

export type LotFormValues = {
  code?: string;
  width_metres?: string | number;
  length_metres?: string | number;
  status?: number;
};