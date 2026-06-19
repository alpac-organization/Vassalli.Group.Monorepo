import type { IAreasServices } from "@app/modules/admin/applications/interfaces/IAreasServices";
import type { IHttpHandler } from "@app/core/ports";
import type { GetAreasRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/get-areas.request";
import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import type { CreateAreaRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/create-area.request";
import type { DeleteAreaRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/delete-cost-center";
export class AreasServices implements IAreasServices {
  private apiHandler: IHttpHandler;
  public constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }
  public async getAreas(payload: GetAreasRequest): Promise<GetAreasResponse[]> {
    try {
      const { company_id } = payload;
      const areas = await this.apiHandler.get<GetAreasResponse[]>(
        `/companies/${company_id}/areas`,
      );
      return areas;
    } catch (error) {
      throw error;
    }
  }
  public async createArea(payload: CreateAreaRequest): Promise<void> {
    try {
      const { company_id, work_area_name, description } = payload;
      const body = {
        work_area_name,
        description: description?.trim() || null,
      };
      const area = await this.apiHandler.post<void>(
        `/companies/${company_id}/areas`,
        body,
      );
      return area;
    } catch (error) {
      throw error;
    }
  }
  public async deleteArea(payload: DeleteAreaRequest): Promise<void> {
    try {
      const { company_id, area_id } = payload;
      await this.apiHandler.delete<void>(
        `/companies/${company_id}/areas/${area_id}`,
      );
    } catch (error) {
      throw error;
    }
  }
}
