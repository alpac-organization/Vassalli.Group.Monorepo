import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface MachineryCatalogItemDto {
  machinery_id: string;
  code?: string;
  brand?: string;
  model?: string;
  type?: number | string;
  status?: number | string;
}

export interface GetMachineryCatalogResponse
  extends PaginateBaseResponse<MachineryCatalogItemDto[]> {
  data: MachineryCatalogItemDto[];
}
