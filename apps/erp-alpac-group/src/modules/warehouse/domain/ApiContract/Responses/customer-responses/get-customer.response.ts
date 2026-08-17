export interface GetCustomerResponse {
  customer_id: string;
  legal_name: string | null;
  identification_number: string | null;
  identification_type: string;
}