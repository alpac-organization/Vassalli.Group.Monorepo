import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetInventoryStocksRequest extends BaseRequest {
  product_code?: string;
  product_name?: string;
  category_id?: string;
  page_size?: number;
  page_number?: number;
}
