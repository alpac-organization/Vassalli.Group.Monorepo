import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ReasonsInventoryRemovalRequest extends BaseRequest
{
    page_size:   number;
    page_number: number;
}