import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface InventoryStocksRequest extends BaseRequest
{
    readonly category_id ?: string;
    readonly is_fuel?:      boolean;
    readonly is_material?:  boolean;
    readonly cost_center_id?: string;
    readonly product_code?: string;
    readonly product_name?: string;

    readonly page_size?:    number;
    readonly page_number?:  number;
}

export interface PatchInventoryStockRequest extends BaseRequest
{
    readonly inventory_stock_id: string;
    readonly minimum_stock?:     number;
    readonly maximum_stock?:     number;
}