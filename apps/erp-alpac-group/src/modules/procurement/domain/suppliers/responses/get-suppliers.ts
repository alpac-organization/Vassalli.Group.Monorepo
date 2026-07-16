export interface GetSuppliersResponse {
  supplier_legal_name: string;
  identification_number: string;
  address: string;
  email_support: string;
  contact_name: string;
  contact_email: string;
  contact_phone_number: string;
  identification_type: string;
  contribution_type: string;
}
export interface GetSuppliersResponseList {
  suppliers: GetSuppliersResponse[];
  total_pages: number;
  total_items: number;
}
