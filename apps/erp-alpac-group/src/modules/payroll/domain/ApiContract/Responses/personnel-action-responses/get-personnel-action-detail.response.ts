import type { PersonnelActionRequestDto } from "./get-personnel-actions.response";

export interface PersonnelActionRequestItemDetailDto {
  item_id: string;
  collaborator_id: string;
  collaborator_code: string;
  collaborator_full_name: string;
  identification_number: string;

  current_salary: number;
  current_currency: number | string;
  current_job_position_name: string;
  current_cost_center_name: string;
  current_work_area_name: string;

  proposed_salary?: number | null;
  proposed_currency?: number | string | null;
  proposed_job_position_id?: string | null;
  proposed_job_position_name?: string | null;
  proposed_cost_center_id?: string | null;
  proposed_cost_center_name?: string | null;

  salary_id?: string | null;
  work_position_history_id?: string | null;
  memorandum_url?: string | null;
}

export interface PersonnelActionRequestDetailDto extends PersonnelActionRequestDto {
  items: PersonnelActionRequestItemDetailDto[];
}
