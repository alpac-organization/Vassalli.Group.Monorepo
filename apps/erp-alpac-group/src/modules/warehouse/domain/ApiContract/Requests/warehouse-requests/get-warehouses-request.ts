import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetWarehouseRequest extends BaseRequest {
  branch_code?: string;
  warehouse_code?: string;
  warehouse_type?: number;
  is_active?: boolean;
  page_number?: number;
  page_size?: number;
}
