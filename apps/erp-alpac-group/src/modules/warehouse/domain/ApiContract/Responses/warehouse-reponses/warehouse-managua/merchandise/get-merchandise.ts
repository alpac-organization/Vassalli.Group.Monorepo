import type { DocumentType } from "@app/core/enums/document.enum";

export interface GetMerchandiseResponse {
  data: MerchandiseRegisterItem[];
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
}

export interface MerchandiseRegisterItem {
  id: string;
  vehicle_plate_number: string;
  driver_name: string;
  container_number: string | null;
  arrival_date: string;
  arrival_time: string;
  document_type: DocumentType;
  total_documents: number;
  completed_documents: number;
  status: string | null;
}
