import type { ICostCentersServices } from "@app/modules/admin/applications/interfaces/ICostCentersServices";
import type { IHttpHandler } from "@app/core/ports";
import type { GetCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/get-cost-centers.request";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";
import type { CreateCostCenterRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/create-cost-center.request";
import type { DeleteCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/delete-cost-centers";
export class CostCentersServices implements ICostCentersServices {
  private apiHandler: IHttpHandler;
  public constructor(httpHandler: IHttpHandler) {
    this.apiHandler = httpHandler;
  }
  public async getCostCenters(
    payload: GetCostCentersRequest,
  ): Promise<GetCostCentersResponse[] | undefined> {
    try {
      const { company_id, area_id } = payload;
      const costCenters = await this.apiHandler.get<
        GetCostCentersResponse[] | undefined
      >(`/companies/${company_id}/areas/${area_id}/cost-centers`);
      return costCenters;
    } catch (error) {
      throw error;
    }
  }
  public async createCostCenter(
    payload: CreateCostCenterRequest,
  ): Promise<void> {
    try {
      const { company_id, area_id, ...body } = payload;
      const costCenter = await this.apiHandler.post<void>(
        `/companies/${company_id}/areas/${area_id}/cost-centers`,
        body,
      );
      return costCenter;
    } catch (error) {
      throw error;
    }
  }
  public async deleteCostCenter(
    payload: DeleteCostCentersRequest,
  ): Promise<void> {
    try {
      const { company_id, area_id, cost_center_id } = payload;
      const costCenter = await this.apiHandler.delete<void>(
        `/companies/${company_id}/areas/${area_id}/cost-centers/${cost_center_id}`,
      );
      return costCenter;
    } catch (error) {
      throw error;
    }
  }
}
