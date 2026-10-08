import type { AssignmentOperationalDto } from "./get-assignments";

export interface WarehouseInformationDto {
  warehouse_id?: string;
  code?: string;
  warehouse_type?: number | string;
}

export interface AssignmentOperationalDetailsDto
  extends AssignmentOperationalDto {
  observations?: string;
  additional_data?: string;
  warehouse_information?: WarehouseInformationDto | null;
}

export type GetAssignmentDetailsResponse = AssignmentOperationalDetailsDto;
