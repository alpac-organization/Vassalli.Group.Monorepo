import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetWarehouseByIdRequest extends BaseRequest {
  warehouse_id: string;
}
