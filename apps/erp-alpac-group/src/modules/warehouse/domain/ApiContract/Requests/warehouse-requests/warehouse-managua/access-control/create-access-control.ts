import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface GeneralInformationRequest {
  custom_branch_id: string;
  seal_number: string;
  country_origin: string;
  container_number: string;
  document_type: number;
  ducat_numbers: string[];
  customs_declaration_number: string | null;
}

export interface TransportInformationRequest {
  driver_name: string;
  driver_license: string;
  transportista: string;
  vehicle_plate_number: string;
  vehicle_chassis_number: string;
  transport_unit: number;
}

export interface CustomsDeclarationInformationRequest {
  total_weight: number;
  package_number: number;
  product_description?: string | null;
  observations?: string | null;
}

export interface CreateReceptionEntrancePayload {
  general_information: GeneralInformationRequest;
  transport_information: TransportInformationRequest;
  customs_declaration_information: CustomsDeclarationInformationRequest | null;
  evidence_base64: string[];
}

export interface CreateAccessControlRequest
  extends BaseRequest,
    CreateReceptionEntrancePayload {}
