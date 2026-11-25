export interface GetCostCentersRequest {
  company_id: string;
  module_code: string;
  area_id: string;
  only_operational?: boolean;
  branch_id?: string;
  only_user_branch?: boolean;
}
