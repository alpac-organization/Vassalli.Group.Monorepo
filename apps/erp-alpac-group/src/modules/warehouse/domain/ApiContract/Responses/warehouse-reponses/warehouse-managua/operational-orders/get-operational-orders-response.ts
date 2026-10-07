import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";
import type { OperationalOrderStatusType } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import type { TransportDocumentType } from "@app/core/enums/document.enum";

export interface CustomerInformation {
	customer_id: string;
	cif: string | null;
	customer_name: string;
}

export interface CostCenterInformation {
	cost_center_id: string;
	description: string | null;
	cost_center_name: string;
	coil_code: number | string;
	cost_center_code: number | string;
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
