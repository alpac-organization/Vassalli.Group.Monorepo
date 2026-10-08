import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface MerchandiseInformation {
	merchandise: string | null;
	merchandise_description: string | null;
}

// PATCH /api/v1/companies/{company_id}/modules/{module_code}/operational-orders/{operational_order_id}/information
export interface UpdateOperationalOrderInformationRequest extends BaseRequest {
	operational_order_id?: string;
	operationalOrderId?: string;
	/** Opcional: obligatorio solo si la orden aún no tiene cliente. */
	customer_id?: string | null;
	package_amount?: number | null;
	merchandise_weight?: number | null;
	shipping_company?: string | null;
	consignee?: string | null;
	sender?: string | null;
	is_alert?: boolean | null;
	/** Acumulativo: cada llamada agrega items; no reemplaza. */
	merchandises?: MerchandiseInformation[] | null;
}
