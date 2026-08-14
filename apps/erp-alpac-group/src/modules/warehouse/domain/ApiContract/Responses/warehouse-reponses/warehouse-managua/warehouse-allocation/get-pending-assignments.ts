import type { DocumentType } from "@app/core/enums/document.enum";

export interface PendingAssignmentItem {
  id: string;
  plate_number: string;
  driver_name: string;
  document_type: DocumentType;
  document_number: string | null;
  container_number: string | null;
  arrival_date: string | null;
  arrival_time: string | null;
  total_documents: number;
  completed_documents: number;
}

export interface PagedWarehouseAssignmentsResponse<T> {
  data: T[];
  total_count: number;
  page_number: number;
  page_size: number;
  total_pages: number;
}

export type GetPendingAssignmentsResponse =
  PagedWarehouseAssignmentsResponse<PendingAssignmentItem>;