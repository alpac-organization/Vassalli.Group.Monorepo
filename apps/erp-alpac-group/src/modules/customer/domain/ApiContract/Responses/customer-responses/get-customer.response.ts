import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface CustomerDto {
  customer_id: string;
  cif: string | null;
  legal_name: string | null;
  customer_code: string | null;
  customer_type: string | null;
  identification_number: string | null;
  identification_type: string;
}

export type GetCustomerResponse = PaginateBaseResponse<CustomerDto[]>;