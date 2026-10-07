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
  reception_entrance_id: string;
  reception_code?: string | null;
  seal_number: string;
  container_number: string;
  country_of_origin: string;
  document_type?: DocumentType | number | string | null;
  created_at: string;
  additional_data: string | AdditionalReceptionEntranceData | null;
  custom_branches_information: CustomBranchesInformation;
  reception_transport_entrance_information: ReceptionTransportEntranceDto;
}
