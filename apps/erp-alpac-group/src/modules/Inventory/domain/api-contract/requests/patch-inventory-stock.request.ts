import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface PatchInventoryStockRequest extends BaseRequest {
   inventory_stock_id: string;
   minimum_stock?: number;
   maximum_stock?: number;
}