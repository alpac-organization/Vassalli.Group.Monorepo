import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export type MachineryType = "Forklift" | string;

export interface MachineryInformationDto {
  machinery_type: MachineryType;
  machinery_code: string;
  machinery_brand: string;
}

export interface AssignmentMachineryDto {
  assignment_machinery_id: string;
  machinery_id: string;
  concept?: string;
  is_active: boolean;
  created_by_user_name: string;
  assignment_operational_id: string;
  machinery_information: MachineryInformationDto;
}

export interface GetAssignmentMachineryResponse extends PaginateBaseResponse<AssignmentMachineryDto[]> {
  data: AssignmentMachineryDto[];
}
