export interface FaultCatalogDto {
  fault_catalog_id: string;
  company_id?: string;
  code: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  fault_severity?: string;
}

export interface GetFaultCatalogResponse {
  data: FaultCatalogDto[];
  page_number: number;
  page_size: number;
  total: number;
}
