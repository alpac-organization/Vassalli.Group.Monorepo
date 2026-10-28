import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface InventoryStocksRequest extends BaseRequest
{
    readonly category_id ?: string;
    readonly product_code?: string;
    readonly product_name?: string;

    readonly page_size?:    number;
    readonly page_number?:  number;
}