import type { PaginateBaseResponse } from "@app/shared/interfaces/paginate-base/paginate-base-response";

export interface MachineryCatalogItemDto {
  machinery_id: string;
  code?: string;
  brand?: string;
  model?: string;
  type?: number | string;
  status?: number | string;
}

export type GetMachineryCatalogResponse = PaginateBaseResponse<MachineryCatalogItemDto>;
