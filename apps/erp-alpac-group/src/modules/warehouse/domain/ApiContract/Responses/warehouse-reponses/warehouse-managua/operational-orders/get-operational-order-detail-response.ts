import type { DocumentType } from "@app/core/enums/document.enum";
import type { OperationalOrderStatusType } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import type {
	AdditionalReceptionEntranceData,
	CustomBranchesInformation,
	ReceptionEntranceDetail,
	ReceptionTransportEntranceDto,
} from "../access-control/get-access-control-detail";
import type {
	CostCenterInformation,
	CustomerInformation,
} from "./get-operational-orders-response";

export type { CustomerInformation, CostCenterInformation };

export interface ReceptionEntranceInformation extends ReceptionEntranceDetail {
	reception_code?: string | null;
	reception_entrance_id: string;
	vehicle_plate_number?: string;
	vehicle_exit_time?: string | null;
	container_exit_time?: string | null;
	seal_number: string;
	container_number: string;
	country_of_origin: string;
	document_type?: string | number | null;
	created_at: string;
	additional_data: AdditionalReceptionEntranceData | string | null;
	custom_branches_information: CustomBranchesInformation;
	reception_transport_entrance_information: ReceptionTransportEntranceDto;
}

export interface GetOperationalOrderDetailResponse {
	operation_order_id: string;
	po_code: string | null;
	status: OperationalOrderStatusType;
	is_alerted: boolean;
	description: string | null;
	policy_number: string | null;
	document_number: string | null;
	document_type: DocumentType | number | string | null;
	weight: number | null;
	packages_count: number | null;
	shipping_company: string | null;
	consignee: string | null;
	sender: string | null;
	customer_information: CustomerInformation | null;
	cost_center_information: CostCenterInformation | null;
	reception_entrance_information: ReceptionEntranceInformation | null;
}

/**
 * Parsea el campo additional_data de la recepción si viene como string JSON serializado.
 */
export function parseOperationalOrderAdditionalData(
	additionalData: string | AdditionalReceptionEntranceData | null | undefined,
): AdditionalReceptionEntranceData | null {
	if (!additionalData) return null;
	if (typeof additionalData === "object") return additionalData;

	try {
		let parsed = JSON.parse(additionalData);
		if (typeof parsed === "string") {
			parsed = JSON.parse(parsed);
		}
		return parsed as AdditionalReceptionEntranceData;
	} catch {
		return null;
	}
}