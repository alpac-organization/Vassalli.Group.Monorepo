import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface CreatePersonnelActionCollaboratorItem {
  collaborator_id: string;
  new_salary?: number | null;
  new_currency?: number | null;
  new_job_position_id?: string | null;
  new_cost_center_id?: string | null;
}

export interface CreatePersonnelActionRequest extends BaseRequest {
  scope: number;
  increase_type: number;
  increase_value?: number | null;
  area_id?: string | null;
  effective_date: string;
  justification: string;
  attachment_base64?: string | null;
  attachment_file_name?: string | null;
  collaborators: CreatePersonnelActionCollaboratorItem[];
}
