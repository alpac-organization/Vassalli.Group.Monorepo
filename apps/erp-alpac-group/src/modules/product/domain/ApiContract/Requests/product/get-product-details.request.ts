import type { SupplierExclusiveStatus } from "@app/core/enums/supplier-exclusive-status.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetProductDetailsRequest extends BaseRequest {
	product_id: string;
	page_number?: number;
	page_size?: number;
	identification_number?: string;
	commercial_name?: string;
	exclusive_status?: SupplierExclusiveStatus;
}
