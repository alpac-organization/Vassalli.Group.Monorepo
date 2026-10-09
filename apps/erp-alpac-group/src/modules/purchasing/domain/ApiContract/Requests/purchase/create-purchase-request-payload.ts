import type { ProductUsageType } from "@app/core/enums/product-usage-type.enum";
import type { PriorityLevelType } from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import type { PurchaseRequestDestinationType } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { PurchaseRequestType } from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface PurchaseRequestMainPayload extends BaseRequest {
	purchase_requests: CreatePurchaseRequestPayload[];
}

export interface CreatePurchaseRequestPayload {
	area_id?: string | null;
	branch_id: string;
	cost_center_id: string;
	service_order_id?: string | null;
	operational_order_id?: string | null;
	observations: string;
	priority_level?: PriorityLevelType;
	destination: PurchaseRequestDestinationType;
	request_type: PurchaseRequestType;
	purchase_request_items: PurchaseRequestItem[];
}

export interface PurchaseRequestItemAdditionalData {
	images_product_to_changed?: string[];
	isDirty?: boolean;
}

export interface NewPurchaseRequestProductSupplier {
	supplier_id: string;
	unit_price?: number | null;
}

export interface NewPurchaseRequestProduct {
	product_name: string;
	description?: string | null;
	category_id: string;
	unit_measure_id: string;
	product_usage_type: ProductUsageType;
	is_tax_exempt?: boolean;
	suppliers: NewPurchaseRequestProductSupplier[];
}

export interface PurchaseRequestItem {
	purchase_request_item_id?: string;
	product_id?: string | null;
	unit_measure_id?: string | null;
	additional_supplier_ids?: string[];
	quantity: number;
	quantity_unit?: number | null;
	description?: string | null;
	justification?: string | null;
	additional_data?: string | null;
	images?: PurchaseRequestItemAdditionalData;
	new_product?: NewPurchaseRequestProduct | null;
	/** @deprecated Prefer `images` / `additional_data` serialization at the UI layer. */
	product_name?: string | null;
}
