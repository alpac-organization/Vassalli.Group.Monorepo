import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface DucatNumberUpdateItem {
  operational_order_id: string;
  document_number: string;
}

export interface GeneralInformationUpdated {
  custom_branch_id?: string;
  seal_number?: string;
  country_origin?: string;
  container_number?: string;
  document_type?: "DUCA" | "CustomsDeclaration" | number | string;
  ducat_numbers?: DucatNumberUpdateItem[];
  customs_declaration_number?: string | null;
}

export interface ReceptionTransportInformationUpdated {
  driver_name?: string;
  driver_license?: string;
  transportista?: string;
  vehicle_plate_number?: string;
  vehicle_chassis_number?: string;
  transport_unit?: number | string;
}

export interface UpdateReceptionEntranceCommandPayload {
  general_information?: GeneralInformationUpdated;
  reception_transport_information?: ReceptionTransportInformationUpdated;
  evidence_base64?: string[];
  evidence_ids_to_delete?: string[];
}

export interface UpdateReceptionEntranceRequest
  extends BaseRequest,
    UpdateReceptionEntranceCommandPayload {
  reception_id?: string;
  reception_entrance_id?: string;
}

