export interface CreateJobPositionsRequest {
  company_id: string;
  module_code: string;
  job_position_name: string;
  description?: string | null;
}
