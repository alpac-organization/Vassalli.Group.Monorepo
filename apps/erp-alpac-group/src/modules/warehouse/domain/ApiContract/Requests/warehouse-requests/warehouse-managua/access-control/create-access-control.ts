export interface BaseCreateReceptionEntrance {
  company_id: string;
  module_code: string;
  document_type: number;
  transport_unit: number;
  country_of_origin: string;
  custom_branch_id: string;
  vehicle_chassis_number: string;
  driver_license: string;
  transportista: string;
  driver_name: string;
  vehicle_plate_number: string;
  container_number: string;
  seal_number: string;
  seal_evidence: SealEvidenceFile[];
  start_date: string;
  start_time: string;
}

export interface DeclarationAduanaPayload extends BaseCreateReceptionEntrance {
  customs_declaration_number: string;
  packages: number;
  customer: string;
  product: string;
}

export interface DucaPayload extends BaseCreateReceptionEntrance {
  ducat_numbers: string[];
}

export interface SealEvidenceFile {
  imageBase64: string;
  contentType: string;
}

export type CreateAccessControlRequest = DeclarationAduanaPayload | DucaPayload;
