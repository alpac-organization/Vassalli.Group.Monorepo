import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DeleteProductRequest extends BaseRequest
{
    product_id: string;
}