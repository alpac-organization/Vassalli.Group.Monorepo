import type { DocumentType } from "@app/core/enums/document.enum";
import type { EnumType } from "@app/shared/types/enum.type";

export interface ReceptionEntranceListItem {
  id?: string;
  reception_entrance_id: string;
  reception_code?: string | null;
  seal_number?: string;
  container_number?: string;
  country_of_origin?: string;
  plate_number?: string;
  driver_name?: string;
  document_type?: DocumentType | number | string;
  arrival_date?: string;
  arrival_time?: string;
  status?: RecordEntranceStatusKey | string;
  vehicle_exited?: boolean;
  container_exited?: boolean;
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

export const RecordEntranceStatusEnum: Record<string, EnumType> = {
  Queue: { value: 1, label: "En cola" },
  Unloading: { value: 2, label: "En descarga" },
  Completed: { value: 3, label: "Completado" },
  Abandoned: { value: 4, label: "Abandonado" },
};
export const RecordEntranceVehicleStatusEnum: Record<string, EnumType> = {
  OnSite: { value: 1, label: "En sitio" },
  Exited: { value: 2, label: "Despachado" },
};

export type RecordEntranceStatusKey = keyof typeof RecordEntranceStatusEnum;
