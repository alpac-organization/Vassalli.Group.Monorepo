import type { CatalogRequest } from "@app/modules/catalog/domain/ApiContract/Requests/catalog.request";
import type { CatalogListResponse } from "@app/modules/catalog/domain/ApiContract/Responses/catalog.response";

export interface ICatalogServices {
  getCatalogList(payload: CatalogRequest): Promise<CatalogListResponse>;
}
