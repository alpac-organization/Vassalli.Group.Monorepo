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
  custom_branch_id?: string;
  vehicle_plate_number?: string;
  vehicle_chassis_number?: string;
  driver_license?: string;
  transportista?: string;
  transport_unit?: number;
  driver_name?: string;
  seal_number?: string;
  customs_declaration_number?: string;
  packages?: number;
  customer?: string;
  product?: string;
  container_number?: string;
}
