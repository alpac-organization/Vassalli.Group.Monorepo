import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetProductDetailsRequest extends BaseRequest {
	product_id: string;
}
