import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";

export interface GetSubwarehouseRequest extends GetWarehouseRequest {
  warehouse_id: string | null ;
}
