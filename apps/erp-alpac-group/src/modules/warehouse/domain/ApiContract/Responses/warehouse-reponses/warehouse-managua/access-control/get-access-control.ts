import type { DocumentType } from "@app/core/enums/document.enum";
import type { EnumType } from "@app/shared/types/enum.type";

export interface ReceptionEntranceListItem {
  id?: string;
  reception_entrance_id: string;
  reception_code?: string | null;
  seal_number?: string;
  container_number?: string;
  country_of_origin?: string;
  vehicle_plate_number?: string;
  driver_name?: string;
  document_type?: DocumentType | number | string;
  vehicle_exit_time?: string | null;
  container_exit_time?: string | null;
}

export interface ReceptionEntranceStatsResponse {
  total_entries: number;
  total_on_site: number;
  total_exists: number;
  total_container_on_site: number;
  total_container_exited: number;
}
export interface GetReceptionEntrancesResponse {
  data: ReceptionEntranceListItem[];
  total: number;
  page_number: number;
  page_size: number;
  total_count?: number;
  total_pages?: number;
  stats?: ReceptionEntranceStatsResponse;
}

export const RecordEntranceVehicleStatusEnum: Record<string, EnumType> = {
  OnSite: { value: 1, label: "En sitio" },
  Exited: { value: 2, label: "Despachado" },
};

