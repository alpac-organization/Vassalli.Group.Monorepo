export interface PendingAssignmentDto {
  reception_id: string;
  license_plate: string;
  driver_name: string;
  entrance_time: string;
  status: string;
  is_consolidated: boolean;
  entrance_ducat_id: string | null;
  document_type: string;
  document_number: string;
  service_order_code: string;
  assignment_id?: string;
  warehouse_name?: string;
  ducat_number?: string | null;
  unloading_start_time?: string;
  unloading_end_time?: string;
}

export interface GetPendingAssignmentsResponse {
  data: PendingAssignmentDto[];
  page_number: number;
  page_size: number;
  total: number;
}
