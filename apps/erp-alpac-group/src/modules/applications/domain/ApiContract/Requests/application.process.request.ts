import type { BaseRequest } from "@app/shared/interfaces/base-request/base-request";

export interface ApplicationProcessRequest extends BaseRequest {  
  permit_application_id: string;
  is_approved: boolean | null;
  // amount_days: number;
}
