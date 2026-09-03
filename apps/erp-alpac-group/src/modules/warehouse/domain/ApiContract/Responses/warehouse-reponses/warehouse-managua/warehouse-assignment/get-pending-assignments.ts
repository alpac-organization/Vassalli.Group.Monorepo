export interface DucaDto {
  entrance_ducat_id: string;
  ducat_number: string;
  status: string;
  service_order_code: string;
  already_assigned: boolean; // false = pendiente de asignar | true = ya asignada
}

export interface PendingAssignmentDto {
  reception_id: string;
  license_plate: string;
  driver_name: string;
  entrance_time: string; // ISO 8601
  status: string;
  is_consolidated: boolean;
  ducas: DucaDto[];
}

export interface GetPendingAssignmentsResponse {
  data: PendingAssignmentDto[];
  page_number: number;
  page_size: number;
  total: number;
}

