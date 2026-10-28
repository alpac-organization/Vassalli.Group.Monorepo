export interface SanctionDto {
  sanction_id: string;
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  sanction_type: string;
  sanction_status: string;
  reason: string;
  suspension_start_date: string | null;
  suspension_end_date: string | null;
  created_at: string;
}

export interface GetSanctionsResponse {
  data: SanctionDto[];
  page_number: number;
  page_size: number;
  total: number;
}
