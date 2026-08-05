import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSupplierDetailsRequest extends BaseRequest {
   supplier_id: string;
}