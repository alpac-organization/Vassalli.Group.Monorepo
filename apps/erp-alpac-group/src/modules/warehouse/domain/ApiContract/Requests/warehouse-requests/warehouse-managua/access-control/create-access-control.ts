export interface CreateAccessControlRequest {
  company_id: string;
  module_code: string;
  ducat_numbers: string[];
  country_of_origin: string;
  aduana: string;
  plate_number: string;
  trailer_chassis: string;
  driver_license: string;
  transportista: string;
  medio: string;
  driver_name: string;
  consignee: string;
  seal_number: string;
  start_date: string;
  start_time: string;
}
