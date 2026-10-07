import type { SupplierExclusiveStatusReview } from "@app/core/enums/supplier-exclusive-status.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface UpdateSupplierExclusiveStatusRequest extends BaseRequest {
	supplier_id: string;
	exclusive_status: SupplierExclusiveStatusReview;
	comments?: string;
}
