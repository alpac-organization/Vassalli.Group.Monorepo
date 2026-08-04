export interface BaseCreateReceptionEntrance {
  company_id: string;
  module_code: string;
  document_type: number;
  transport_unit_id: string;
  country_of_origin: string;
  aduana: string;
  trailer_chassis: string;
  driver_license: string;
  transportista: string;
  driver_name: string;
  plate_number: string;
  seal_number: string;
  start_date: string;
  start_time: string;
}

export interface DeclarationAduanaPayload extends BaseCreateReceptionEntrance {
  customs_declaration_number: string;
  packages: number;
  customer: string;
  product: string;
  container_number: string;
}

export interface DucaPayload extends BaseCreateReceptionEntrance {
  ducat_numbers: string[];
}

export type CreateAccessControlRequest =
  | DeclarationAduanaPayload
  | DucaPayload;
