export interface CreateAreaRequest {
  company_id: string;
  module_code: string;
  work_area_name: string;
  description?: string | null;
}
