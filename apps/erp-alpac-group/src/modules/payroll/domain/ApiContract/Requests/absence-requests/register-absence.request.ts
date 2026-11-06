import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface RegisterAbsenceRequest  extends BaseRequest {
  collaborator_id: string;
  date: string;
  reason?: string | null;
  source?: number;
}
