import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GetSupplierDetailsRequest extends BaseRequest {
	supplier_id: string;
	page_number?: number;
	page_size?: number;
	code?: string;
	unit_measure_id?: string;
}
