export interface UpdateDucatItem {
  id?: string;
  ducat_number: string;
}

export interface UpdateReceptionEntranceRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  ducats?: UpdateDucatItem[];
  country_of_origin?: string;
  aduana?: string;
  plate_number?: string;
  trailer_chassis?: string;
  driver_license?: string;
  transportista?: string;
  transport_unit_id?: string;
  driver_name?: string;
  seal_number?: string;
  customs_declaration_number?: string;
  packages?: number;
  customer?: string;
  product?: string;
  container_number?: string;
}
