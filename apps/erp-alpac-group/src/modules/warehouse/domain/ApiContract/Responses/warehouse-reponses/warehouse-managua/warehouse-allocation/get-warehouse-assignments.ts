import type { DocumentType } from "@app/core/enums/document.enum";
import type { PagedWarehouseAssignmentsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";

export interface WarehouseAssignmentListItem {
  reception_id: string;
  plate_number: string;
  driver_name: string;
  document_type: DocumentType;
  warehouse_name: string;
  warehouse_type: number;
  section_code: string | null;
  rack_code: string | null;
  lot_code: string | null;
  assigned_at: string;
  is_completed: boolean;
  crew_count: number;
  machinery_count: number;
}

export type GetWarehouseAssignmentsResponse =
  PagedWarehouseAssignmentsResponse<WarehouseAssignmentListItem>;