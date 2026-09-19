import type { RegisterLotRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/create-lots-req";

export interface LotModalProps {
  isOpen: boolean;
  warehouseId: string;
  sectionId: string;
  onClose: () => void;
  onSubmit?: (data: RegisterLotRequest) => void;
}

export type LotFormValues = {
  quantity?: string | number;
  nominal_rows?: string | number;
  nominal_columns?: string | number;
  width?: string | number;
  length?: string | number;
};