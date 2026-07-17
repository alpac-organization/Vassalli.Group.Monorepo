import type { CreateEntryDriverRequest } from "@app/modules/warehouse/warehouse-managua/domain/requests/entry-drivers/create-entry-driver";
export interface IEntryDriverServices {
  createEntryDriver(payload: CreateEntryDriverRequest): Promise<void>;
}
