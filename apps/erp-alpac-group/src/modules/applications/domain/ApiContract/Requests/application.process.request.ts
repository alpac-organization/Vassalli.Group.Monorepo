export interface ApplicationProcessRequest {
  company_id: string;
  module_code: string;
  permit_application_id: string;
  is_approved: boolean | null;
  // amount_days: number;
}
