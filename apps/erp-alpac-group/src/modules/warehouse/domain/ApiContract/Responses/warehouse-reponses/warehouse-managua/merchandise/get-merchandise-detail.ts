import type { DocumentType } from "@app/core/enums/document.enum";
import type { RecordEntranceStatusKey } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export interface GetMerchandiseDetailResponse {
  id: string;
  status: RecordEntranceStatusKey;
  reception: MerchandiseReceptionDetailDto;
  merchandise_registration: MerchandiseRegistrationLog;
  duca_registry: MerchandiseDucaRegistryDetail | null;
  customs_declaration: MerchandiseDeclarationAduanaDetail | null;
}

export interface MerchandiseReceptionDetailDto {
  country_of_origin: string;
  custom_branch: string;
  vehicle_plate_number: string;
  vehicle_chassis_number: string;
  container_number: string | null;
  driver_license: string;
  transportista: string;
  driver_name: string;
  seal_number: string;
  seal_evidence: string[] | string | null;
  document_type: DocumentType;
  transport_unit: string | null;
  vehicle_exit_date: string | null;
  vehicle_exit_time: string | null;
  container_exit_date: string | null;
  container_exit_time: string | null;
}

export interface MerchandiseRegistrationLog {
  merchandise_registration_end_date: string | null;
  merchandise_registration_end_time: string | null;
  merchandise_finished_by_user_name: string | null;
  duration_total_seconds: number | null;
  duration_formatted: string | null;
  merchandise_registration_date: string | null;
  merchandise_registration_time: string | null;
  merchandise_registered_by_user_name: string | null;
}

export interface MerchandiseDucaRegistryDetail {
  shipping_company_id: string | null;
  sipping_company_name: string | null;
  general_observations: string | null;
  is_in_transit: boolean | null;
  status: string | null;

  registered_by_user_name: string | null;
  registered_start_date: string | null;
  registered_end_date: string | null;
  registered_start_time: string | null;
  registered_end_time: string | null;

  updated_by_user_name: string | null;
  updated_date: string | null;
  updated_time: string | null;

  duration_in_seconds: number | null;
  duration_formatted: string | null;
  ducats: MerchandiseDucatDetailDto[] | null;
}

export interface MerchandiseDucatDetailDto {
  id: string;
  ducat_number: string;
  status: string;
  type: string | null;
  merchandise_id: string | null;
  merchandise_name: string | null;
  total_bultos: number | null;
  total_weight: number | null;
  merchandise_description: string | null;
  sender: string | null;
  destination_area_observation: string | null;
  service_order_id: string | null;
  service_order_code: string | null;
  registered_by_user_name: string | null;
  registered_start_date: string | null;
  registered_end_date: string | null;
  registered_start_time: string | null;
  registered_end_time: string | null;
  duration_in_seconds: number | null;
  duration_formatted: string | null;
  updated_by_user_name: string | null;
  updated_date: string | null;
  updated_time: string | null;
}

export interface MerchandiseDeclarationAduanaDetail {
  customs_declaration_number: string;
  packages: number | null;
  customer: string | null;
  product: string | null;
  service_order_id: string | null;
  service_order_code: string | null;
}
