export interface CreateCustomerRequest {
  company_id: string;
  module_code: string;
  cif: string;
  legal_name: string;
  picture_base64?: string | null;
  identification_number: string;
  identification_type: number;
  customer_type_id: string;
}
