import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface AbsenceDto {
  absence_id: string;
  collaborator_id: string;
  fullname: string;
  identification_number: string;
  branch_name?: string | null;
  date: string;
  status: string | number;
  source: string | number;
}


export type GetAbsencesResponse = PaginateBaseResponse<AbsenceDto>;
