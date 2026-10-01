import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";
import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: WarehouseDto | null;
  onSubmit?: (data: CreateWarehouseRequest) => void;
}

export type FormValues = {
  code: string;
  warehouse_type: number;
  is_active: boolean;
  width?: number;
  length?: number;
  minimum_height?: number;
  maximum_height?: number;
  has_margins: boolean;
  margin_top?: number;
  margin_bottom?: number;
  margin_left?: number;
  margin_right?: number;
  warehouse_location: {
    location_name: string;
  };
};
