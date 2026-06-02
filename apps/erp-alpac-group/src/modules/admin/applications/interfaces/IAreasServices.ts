import type { GetAreasRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/get-areas.request";
import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import type { CreateAreaRequest } from "@app/modules/admin/domain/ApiContract/requests/areas/create-area.request";
export interface IAreasServices {
  getAreas(payload: GetAreasRequest): Promise<GetAreasResponse[]>;
  createArea(payload: CreateAreaRequest): Promise<void>;
}
