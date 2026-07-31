import type { DocumentType } from "@app/core/enums/document.enum";
import type { EnumType } from "@app/shared/types/enum.type";

export interface GetReceptionEntrancesResponse {
  data: ReceptionEntranceListItem[];
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
  stats: ReceptionEntranceStatsResponse;
}
export interface ReceptionEntranceListItem {
  id: string;
  plate_number: string;
  driver_name: string;
  document_type: DocumentType;
  arrival_time: string;
  status: RecordEntranceStatusKey | string;
}

export interface ReceptionEntranceStatsResponse {
  total_entries: number;
  total_on_site: number;
  total_exists: number;
}

export const RecordEntranceStatusEnum: Record<string, EnumType> = {
  Queue: { value: 1, label: "En cola" },
  Unloading: { value: 2, label: "En descarga" },
  Completed: { value: 3, label: "Completado" },
  Abandoned: { value: 4, label: "Abandonado" },
};

export type RecordEntranceStatusKey = keyof typeof RecordEntranceStatusEnum;
