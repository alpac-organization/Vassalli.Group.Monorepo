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
  container_number: string | null;
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
  empresa: string | null;
  general_observations: string | null;
  is_in_transit: boolean | null;

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
  merchandise_id: string | null;
  merchandise_name: string | null;
  total_bultos: number | null;
  total_weight: number | null;
  product_description: string | null;
  remitente: string | null;
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
