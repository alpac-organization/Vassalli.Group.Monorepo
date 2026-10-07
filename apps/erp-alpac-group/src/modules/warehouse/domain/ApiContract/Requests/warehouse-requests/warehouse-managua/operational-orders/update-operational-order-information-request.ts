import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface MerchandiseInformation {
  merchandise: string;
  merchandise_description: string;
}

export interface UpdateOperationalOrderInformationRequest extends BaseRequest {
  operational_order_id?: string;
  operationalOrderId?: string;
  customer_id: string;
  package_amount: number;
  merchandise_weight: number;
  has_merchandise?: boolean;
  merchandise_information?: MerchandiseInformation | null;
}
