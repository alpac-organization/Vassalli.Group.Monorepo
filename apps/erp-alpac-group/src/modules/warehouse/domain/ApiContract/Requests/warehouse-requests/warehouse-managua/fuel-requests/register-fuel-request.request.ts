import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterFuelRequest extends BaseRequest {
  justification: string;
  machinery_id: string;
  product_stock_id: string;
  requested_quantity: number;
  mileage?: number;
  engine_hours?: number;
  customer_id?: string;
}
