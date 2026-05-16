import type { IHttpHandler } from '@app/core/ports';
import type { ICatalogServices } from '@app/modules/catalog/application/interfaces/ICatalogServices';
import type { CatalogRequest } from '@app/modules/catalog/domain/ApiContract/Requests/catalog.request';
import type { CatalogResponse } from '@app/modules/catalog/domain/ApiContract/Responses/catalog.response';

export class CatalogServices implements ICatalogServices {
  private apiHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }

  async getCatalogList(payload: CatalogRequest): Promise<CatalogResponse[]> {
    try {
      const response = await this.apiHandler.get<CatalogResponse[]>(
        `/companies/${payload.company_id}/catalogs/${payload.catalog_type_id}/details`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
