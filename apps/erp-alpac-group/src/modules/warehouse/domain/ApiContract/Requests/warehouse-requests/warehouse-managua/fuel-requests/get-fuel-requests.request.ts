import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { OutflowStatus } from "@app/core/enums/outflow-status.enum";

export interface GetFuelRequestsRequest extends BaseRequest {
  code?: string;
  branch_id?: string;
  machinery_id?: string;
  product_stock_id?: string;
  status?: OutflowStatus;

  page_number: number;
  page_size: number;
}
