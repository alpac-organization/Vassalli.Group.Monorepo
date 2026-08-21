import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";

export interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateWarehouseRequest) => void;
  parentWarehouseId?: string | null;
}

export type FormValues = {
  branch_id: string;
  code: string;
  warehouse_name: string;
  warehouse_type: number;
  warehouse_details: {
    width_metres?: number;
    length_metres?: number;
    ramps_count?: number;
    parking_spaces_count?: number;
  };
};
