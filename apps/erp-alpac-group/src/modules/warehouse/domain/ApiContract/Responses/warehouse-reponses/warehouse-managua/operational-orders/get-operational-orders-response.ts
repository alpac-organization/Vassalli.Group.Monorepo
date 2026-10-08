import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { OperationalOrderStatusType } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import type { TransportDocumentType } from "@app/core/enums/document.enum";

export interface CustomerInformation {
	customer_id?: string | null;
	cif?: string | null;
	legal_name?: string | null;
	customer_code?: string | null;
	identification_number?: string | null;
	customer_type?: string | null;
	identification_type?: string | number | null;
	picture_url?: string | null;
}

export interface CostCenterInformation {
	cost_center_id?: string | null;
	description?: string | null;
	cost_center_name?: string | null;
	coil_code?: number | string | null;
	cost_center_code?: number | string | null;
}

export interface OperationalOrderListItem {
	operation_order_id: string;
	po_code: string;
	document_number: string | null;
	document_type: TransportDocumentType | null;
	status: OperationalOrderStatusType;
	is_alerted: boolean;
}

export type GetOperationalOrdersResponse = PaginateBaseResponse<OperationalOrderListItem[]>;
