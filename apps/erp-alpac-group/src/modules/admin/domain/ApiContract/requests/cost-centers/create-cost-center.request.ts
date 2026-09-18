export interface CreateCostCenterRequest {
  company_id: string;
  module_code: string;
  area_id: string;
  cost_center_name: string;
  coil_code: number;
  description?: string | null;
}
