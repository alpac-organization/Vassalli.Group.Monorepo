import type { SupplierExclusiveStatus } from "@app/core/enums/supplier-exclusive-status.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSuppliersRequest extends BaseRequest {
	commercial_name?: string;
	identification_number?: string;
	constitution_type?: number | string;
	exclusive_status?: SupplierExclusiveStatus;
	page_number?: number;
	page_size?: number;
}
