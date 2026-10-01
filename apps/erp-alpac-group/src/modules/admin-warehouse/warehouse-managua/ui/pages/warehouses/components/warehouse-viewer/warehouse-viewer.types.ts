import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";

export interface WarehouseViewerProps {
  className?: string;
  warehouse?: WarehouseDto | null;
}
