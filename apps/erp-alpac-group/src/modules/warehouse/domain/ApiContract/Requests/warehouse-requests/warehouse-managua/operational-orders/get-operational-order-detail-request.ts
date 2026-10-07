import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetOperationalOrderDetailRequest extends BaseRequest {  
  operational_order_id?: string;
}
