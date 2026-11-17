import type {
  InventoryOutputsRequest,
  GetInventoryOutputDetailRequest,
  StartInventoryOutputRequest,
  ConfirmInventoryOutputRequest,
  RejectInventoryOutputRequest,
} from "@app/modules/Inventory/domain/api-contract/requests/inventory-outputs.request";
import type { PagedInventoryOutputsResponse, InventoryOutputDetailDto } from "@app/modules/Inventory/domain/api-contract/responses/inventory-outputs.response";

export interface IInventoryOutputsServices {
  GetInventoryOutputs(payload: InventoryOutputsRequest): Promise<PagedInventoryOutputsResponse>;
  GetInventoryOutputDetail(payload: GetInventoryOutputDetailRequest): Promise<InventoryOutputDetailDto>;
  StartInventoryOutput(payload: StartInventoryOutputRequest): Promise<void>;
  ConfirmInventoryOutput(payload: ConfirmInventoryOutputRequest): Promise<void>;
  RejectInventoryOutput(payload: RejectInventoryOutputRequest): Promise<void>;
}