export interface GetAreasResponse {
  company_id: string;
  work_area_id: string;
  work_area_code: string;
  work_area_name: string;
  descripcion: string | null;
  cost_centers: CostCenters[];
}

export interface CostCenters {
  area_id: string;
  cost_center_id: string;
  descripcion: string;
  cost_center_name: string;
}