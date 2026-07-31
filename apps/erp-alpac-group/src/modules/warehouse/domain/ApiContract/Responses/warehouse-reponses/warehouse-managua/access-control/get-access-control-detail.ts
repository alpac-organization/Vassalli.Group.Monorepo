import type { DocumentType } from "@app/core/enums/document.enum";
import type { RecordEntranceStatusKey } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export interface ReceptionEntranceDucat {
  id: string;
  ducat_number: string;
}

export interface CustomsDeclarationDetail {
  customs_decaration_number: string;
  packages: number | null;
  customer: string | null;
  product: string | null;
  container_number: string | null;
}

export interface ExecutionLogDetail {
  start_date: string;
  start_time: string;
  end_date: string | null;
  end_time: string | null;
  processed_by_user_name: string;
  duration_total_seconds: number | null;
  duration_formatted: string | null;
}

export interface ReceptionEntranceDetail {
  id: string;
  status: RecordEntranceStatusKey;
  is_consolidated: boolean;
  country_of_origin: string;
  aduana: string;
  plate_number: string;
  trailer_chassis: string;
  driver_license: string;
  transportista: string;
  transport_unit_id: string;
  transport_unit_name: string | null;
  driver_name: string;
  seal_number: string;
  document_type: DocumentType;
  transport_unit_exit_date: string | null;
  transport_unit_exit_time: string | null;
  updated_by_user_name: string | null;
  updated_date: string | null;
  updated_time: string | null;
  ducats: ReceptionEntranceDucat[] | null;
  customs_declaration: CustomsDeclarationDetail | null;
  execution_log: ExecutionLogDetail | null;
}
