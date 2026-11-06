export interface CustomBranchesInformation {
  code: string;
  customs_branch_name: string;
  custom_branch_id?: string;
  custom_branch_code?: string;
}

export interface ReceptionTransportEntranceDto {
  driver_name: string;
  driver_license: string;
  transportista: string;
  vehicle_plate_number: string;
  vehicle_chassis_number: string;
  transport_unit: string | number;
}

export interface AdditionalDataEvidenceUrl {
  image_id?: string;
  document_id?: string;
  image_url?: string;
  document_url?: string;
}

export interface AdditionalDataDocumentNumber {
  document_id?: string;
  operational_order_id?: string;
  document_numbers: string;
  document_type: number | string;
}

export interface AdditionalReceptionEntranceData {
  evidence_urls?: AdditionalDataEvidenceUrl[];
  document_numbers?: AdditionalDataDocumentNumber[];
}

export interface ReceptionEntranceDetail {
  reception_entrance_id?: string | null;
  reception_code?: string | null;
  seal_number?: string | null;
  container_number?: string | null;
  country_of_origin?: string | null;
  document_type?: DocumentType | number | string | null;
  created_at?: string | null;
  additional_data?: AdditionalReceptionEntranceData | string| null;
  custom_branches_information?: CustomBranchesInformation | null;
  reception_transport_entrance_information?: ReceptionTransportEntranceDto | null;
}
