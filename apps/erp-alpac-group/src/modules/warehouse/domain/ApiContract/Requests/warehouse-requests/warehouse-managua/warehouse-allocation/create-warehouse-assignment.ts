export interface CreateWarehouseAssignmentRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  warehouse_id: string;
  section_id?: string;
  rack_id: string;
  lots_id?: string;
  lots_positions_id?: string;
  rack_positions_id?: string;
}