import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { IInventoryOutputsServices } from "@app/modules/Inventory/application/interfaces/services/IInventoryOutputsServices";
import type {
  InventoryOutputsRequest,
  GetInventoryOutputDetailRequest,
  StartInventoryOutputRequest,
  ConfirmInventoryOutputRequest,
  RejectInventoryOutputRequest,
} from "@app/modules/Inventory/domain/api-contract/requests/inventory-outputs.request";
import type { PagedInventoryOutputsResponse, InventoryOutputDetailDto } from "@app/modules/Inventory/domain/api-contract/responses/inventory-outputs.response";

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

  async StartInventoryOutput(payload: StartInventoryOutputRequest): Promise<void> {
    const { company_id, module_code, inventory_output_id } = payload;

    return this.httpClient.post<void>(
      `/companies/${company_id}/modules/${module_code}/inventory/inventory-outputs/${inventory_output_id}/start-dispatch`,
      {},
    );
  }

  async ConfirmInventoryOutput(payload: ConfirmInventoryOutputRequest): Promise<void> {
    const { company_id, module_code, inventory_output_id } = payload;

    return this.httpClient.post<void>(
      `/companies/${company_id}/modules/${module_code}/inventory/inventory-outputs/${inventory_output_id}/confirm-dispatch`,
      {},
    );
  }

  async RejectInventoryOutput(payload: RejectInventoryOutputRequest): Promise<void> {
    const { company_id, module_code, inventory_output_id, ...body } = payload;

    const requestBody = cleanParams({
      dispatched_justification: body.dispatched_justification,
    });

    return this.httpClient.post<void>(
      `/companies/${company_id}/modules/${module_code}/inventory/inventory-outputs/${inventory_output_id}/reject-dispatch`,
      requestBody,
    );
  }
}