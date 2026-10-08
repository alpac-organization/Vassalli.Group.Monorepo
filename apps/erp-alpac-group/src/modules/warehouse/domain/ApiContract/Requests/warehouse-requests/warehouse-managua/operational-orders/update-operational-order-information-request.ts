import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface MerchandiseInformation {
	merchandise: string | null;
	merchandise_description: string | null;
}

export interface UpdateOperationalOrderInformationRequest extends BaseRequest {
	operational_order_id?: string;
	operationalOrderId?: string;
	customer_id?: string | null;
	package_amount?: number | null;
	merchandise_weight?: number | null;
	shipping_company?: string | null;
	consignee?: string | null;
	sender?: string | null;
	is_alerted?: boolean | null;
	merchandises?: MerchandiseInformation[] | null;
}
