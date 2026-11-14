import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { ReasonUse } from "@app/core/enums/reason-use.enum";

export interface RegisterSupplyRequestItem {
  product_stock_id: string;
  amount: number;
}

export interface RegisterSupplyRequest extends BaseRequest {
  justification: string;
  operational_order_id: string;
  items: RegisterSupplyRequestItem[];
  reason_use: ReasonUse;
}
