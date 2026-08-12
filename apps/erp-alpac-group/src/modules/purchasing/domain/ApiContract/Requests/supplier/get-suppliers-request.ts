export interface GetSuppliersRequest {
  companie_id: string;
  module_code: string;
  identification_number?: string;
  constitution_type?: number;
  page_number?: number;
  page_size?: number;
}
