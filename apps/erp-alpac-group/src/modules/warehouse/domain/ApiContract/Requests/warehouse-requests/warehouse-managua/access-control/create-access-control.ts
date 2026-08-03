export interface CreateAccessControlRequest {
  company_id: string;
  module_code: string;
  ducat_numbers: string[];
  document_type: number;
  customs_declaration_number?: string;
  packages?: number;
  customer?: string;
  product?: string;
  container_number?: string;
  transport_unit_id: string;
  country_of_origin: string;
  aduana: string;
  trailer_chassis: string;
  driver_license: string;
  transportista: string;
  medio: string;
  driver_name: string;
  plate_number: string;
  seal_number: string;
  start_date: string;
  start_time: string;
}
