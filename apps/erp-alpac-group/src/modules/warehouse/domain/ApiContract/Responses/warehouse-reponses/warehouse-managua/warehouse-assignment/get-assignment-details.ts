import type { AssignmentOperationalDto } from "./get-assignments";

export interface WarehouseInformationDto {
  warehouseId: string;
  code: string;
  warehouseType: number | string;
}

export interface AssignmentOperationalDetailsDto
  extends AssignmentOperationalDto {
  observations?: string;
  additionalData?: string;
  warehouseInformation?: WarehouseInformationDto | null;
}

export type GetAssignmentDetailsResponse = AssignmentOperationalDetailsDto;
