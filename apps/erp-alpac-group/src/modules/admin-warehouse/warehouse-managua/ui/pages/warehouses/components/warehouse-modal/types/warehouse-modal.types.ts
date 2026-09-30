import type { CreateWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/create-warehouse-request";

export interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CreateWarehouseRequest) => void;
}

export type FormValues = {
  code: string;
  warehouse_type: number;
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
