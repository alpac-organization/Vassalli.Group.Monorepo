import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { IInventoryOutputsServices } from "../../application/interfaces/services/IInventoryOutputsServices";
import type { InventoryOutputsRequest, GetInventoryOutputDetailRequest } from "../../domain/api-contract/requests/inventory-outputs.request";
import type { PagedInventoryOutputsResponse, InventoryOutputDetailDto } from "../../domain/api-contract/responses/inventory-outputs.response";

export class InventoryOutputsServices implements IInventoryOutputsServices {
  private readonly httpClient: IHttpHandler;

  constructor(httpClient: IHttpHandler) {
    this.httpClient = httpClient;
  }

  async GetInventoryOutputs(payload: InventoryOutputsRequest): Promise<PagedInventoryOutputsResponse> {
    const { company_id, module_code, ...rest } = payload;

    return this.httpClient.get<PagedInventoryOutputsResponse>(
      `/companies/${company_id}/modules/${module_code}/inventory/inventory-outputs`,
      {
        params: cleanParams(rest),
      },
    );
  }

  async GetInventoryOutputDetail(payload: GetInventoryOutputDetailRequest): Promise<InventoryOutputDetailDto> {
    const { company_id, module_code, inventory_output_id, ...rest } = payload;

    return this.httpClient.get<InventoryOutputDetailDto>(
      `/companies/${company_id}/modules/${module_code}/inventory/inventory-outputs/${inventory_output_id}/detail`,
      {
        params: cleanParams(rest),
      },
    );
  }
}