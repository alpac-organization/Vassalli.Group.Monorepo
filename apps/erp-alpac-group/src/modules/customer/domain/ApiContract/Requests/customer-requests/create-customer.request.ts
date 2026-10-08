import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreateCustomerRequest extends BaseRequest {
  cif: string;
  legal_name: string;
  picture_base64?: string | null;
  identification_number: string;
  identification_type: number;
  customer_type_id: string;
}
