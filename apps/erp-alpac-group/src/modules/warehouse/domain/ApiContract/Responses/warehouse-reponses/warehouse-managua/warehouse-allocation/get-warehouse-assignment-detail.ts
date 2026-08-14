import type { PendingAssignmentItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-pending-assignments";

export interface WarehouseAssignmentInfo {
  warehouse_id: string;
  warehouse_name: string;
  warehouse_code: string;
  warehouse_type: number;
  section_id: string | null;
  section_code: string | null;
  rack_id: string;
  rack_code: string | null;
  lots_id: string | null;
  lots_positions_id: string | null;
  rack_positions_id: string | null;
  assigned_at: string;
  assigned_by_user_id: string;
}

export interface UnloadingDetailsInfo {
  unloading_details_id: string;
  unloading_start_time: string | null;
  unloading_end_time: string | null;
  warehouse_chief_user_id: string | null;
  prepared_pallets: number | null;
}

export interface UnloadingCrewInfo {
  unloading_crew_assignment_id: string;
  persona_count: number;
  tercerizada: boolean;
  assigned_at: string;
}

export interface UnloadingMachineryInfo {
  id: string;
  machinery_id: string;
  machinery_name: string;
  machinery_code: string;
  machinery_type: number;
  start_time: string | null;
  end_time: string | null;
}

export interface GetWarehouseAssignmentDetailResponse {
  reception: PendingAssignmentItem;
  assignment: WarehouseAssignmentInfo | null;
  unloading_details: UnloadingDetailsInfo | null;
  crew: UnloadingCrewInfo | null;
  machinery: UnloadingMachineryInfo[];
}