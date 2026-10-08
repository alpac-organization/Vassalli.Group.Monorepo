import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DeleteProductSupplierLinkRequest extends BaseRequest {
	product_id: string;
	supplier_id: string;
}
