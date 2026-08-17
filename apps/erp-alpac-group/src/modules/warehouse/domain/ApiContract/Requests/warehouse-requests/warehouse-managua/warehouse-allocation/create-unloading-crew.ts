export interface CreateUnloadingCrewRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  persona_count: number;
  tercerizada: boolean;
}