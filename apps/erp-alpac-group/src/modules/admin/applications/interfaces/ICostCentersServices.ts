import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";
import type { GetCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/get-cost-centers.request";
import type { CreateCostCenterRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/create-cost-center.request";
import type { DeleteCostCentersRequest } from "@app/modules/admin/domain/ApiContract/requests/cost-centers/delete-cost-centers";
export interface ICostCentersServices {
  getCostCenters(
    payload: GetCostCentersRequest,
  ): Promise<GetCostCentersResponse[] | undefined>;

  createCostCenter(payload: CreateCostCenterRequest): Promise<void>;

  deleteCostCenter(payload: DeleteCostCentersRequest): Promise<void>;
}
