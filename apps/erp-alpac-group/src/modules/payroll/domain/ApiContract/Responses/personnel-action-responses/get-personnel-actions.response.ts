import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface PersonnelActionRequestDto {
  id: string;
  request_code: string;
  scope: number | string;
  status: number | string;
  increase_type: number | string;
  increase_value?: number | null;
  area_id?: string | null;
  area_name?: string | null;
  effective_date: string;
  justification: string;
  attachment_url?: string | null;
  total_collaborators: number;
  requested_by_user_id: string;
  requested_by_user_name: string;
  requested_at: string;
  reviewed_by_management_user_id?: string | null;
  reviewed_by_management_user_name?: string | null;
  reviewed_by_management_at?: string | null;
  management_notes?: string | null;
  applied_by_user_id?: string | null;
  applied_by_user_name?: string | null;
  applied_at?: string | null;
}

export type GetPersonnelActionsResponse =
  PaginateBaseResponse<PersonnelActionRequestDto>;
