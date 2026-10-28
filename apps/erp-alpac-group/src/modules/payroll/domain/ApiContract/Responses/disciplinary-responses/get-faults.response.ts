export interface FaultCatalogRefDto {
  fault_catalog_id: string;
  code: string;
  name: string;
}

export interface FaultDto {
  fault_id: string;
  collaborator_id: string;
  collaborator_name: string;
  fault_catalog: FaultCatalogRefDto;
  occurrence_date: string;
  severity: string;
  source: string;
  status: string;
}

export interface GetFaultsResponse {
  data: FaultDto[];
  page_number: number;
  page_size: number;
  total: number;
}
