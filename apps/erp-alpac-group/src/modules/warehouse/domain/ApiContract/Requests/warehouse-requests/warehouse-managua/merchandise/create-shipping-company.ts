import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateShippingCompanyRequest extends BaseRequest 
{
    name: string;
}