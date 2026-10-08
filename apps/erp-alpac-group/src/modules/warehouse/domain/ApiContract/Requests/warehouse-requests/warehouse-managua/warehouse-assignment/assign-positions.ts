import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface TramoPositionPayload {
  block_id: string;
  position_ids: string[];
}

export interface RackPositionPayload {
  block_id: string;
  position_ids: string[];
}

export interface SectionPositionsPayload {
  section_id: string;
  tramos?: TramoPositionPayload[];
  racks?: RackPositionPayload[];
}

export interface AssignPositionsBody {
  sections: SectionPositionsPayload[];
}

export interface AssignPositionsRequest
  extends AssignPositionsBody,
    BaseRequest {
  operational_order_id: string;
  assignment_id: string;
}
