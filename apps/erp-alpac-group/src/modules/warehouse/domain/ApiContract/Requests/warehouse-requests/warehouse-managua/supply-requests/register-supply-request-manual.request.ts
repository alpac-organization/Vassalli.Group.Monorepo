import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";
import type { ReasonUse } from "@app/core/enums/reason-use.enum";

export interface RegisterSupplyRequestManualItem {
  product_stock_id: string;
  amount: number;
}

export interface RegisterSupplyRequestManual extends BaseRequest {
  justification: string;
  warehouse_id: string;
  items: RegisterSupplyRequestManualItem[];
  reason_use: ReasonUse;
  equipment_id?: string;
  customer_id?: string;
  duca_or_transport_order?: string;
}