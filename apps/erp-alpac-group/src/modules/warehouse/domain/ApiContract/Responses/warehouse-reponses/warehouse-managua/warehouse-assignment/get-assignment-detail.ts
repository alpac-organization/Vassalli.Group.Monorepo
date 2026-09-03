export interface CrewDetailDto {
  is_outsourced: boolean;
  provider_name: string | null;
  invoice_number: string | null;
  total_person_count: number;
  collaborator_ids: string[];
  collaborator_names: string[];
  crew_assignment_ids: string[];
}

export interface MachineryDetailDto {
  machinery_assignment_id: string;
  is_outsourced: boolean;
  machinery_id: string | null;
  machinery_code: string | null;
  machinery_name: string | null;
  operator_collaborator_id: string | null;
  operator_name: string | null;
  provider_name: string | null;
  invoice_number: string | null;
  machinery_description: string | null;
}

export interface WarehouseAssignmentDetailResponse {
  reception_id: string;
  assignment_id: string;
  license_plate: string;
  warehouse_name: string;
  ducat_number: string | null;
  service_order_code: string | null;
  crews: CrewDetailDto[];
  machineries: MachineryDetailDto[];
}

