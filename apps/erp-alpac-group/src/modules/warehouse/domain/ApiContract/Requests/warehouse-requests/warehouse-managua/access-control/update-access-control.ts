export interface UpdateReceptionEntranceRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  country_of_origin?: string;
  aduana?: string;
  plate_number?: string;
  trailer_chassis?: string;
  driver_license?: string;
  transportista?: string;
  driver_name?: string;
  seal_number?: string;
  customs_decaration_number?: string;
  packages?: number;
  customer?: string;
  product?: string;
  container_number?: string;
  transport_unit_id?: string;
}
