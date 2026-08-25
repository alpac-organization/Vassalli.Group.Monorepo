import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetServiceOrdersRequest extends BaseRequest{
   code?: string;
   cif?: string;
   page_number: number;
   page_size: number;
}