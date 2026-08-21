import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse";

export interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateWarehouseRequest) => void;
  parentWarehouseId?: string | null;
}
