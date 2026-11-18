import { cleanParams } from "@app/shared/utils/object.utils";

import type { IHttpHandler } from "@app/core/ports";
import type { GetEquipmentRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-equipment.request";
import type { PagedEquipmentResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-equipment.response";

export class EquipmentServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httpHandler: IHttpHandler) {
    this.httpHandler = httpHandler;
  }

  async GetEquipments(payload: GetEquipmentRequest): Promise<PagedEquipmentResponse> {
    const { company_id, module_code, ...rest } = payload;
    return this.httpHandler.get<PagedEquipmentResponse>(
      `/companies/${company_id}/modules/${module_code}/equipment`,
      { params: cleanParams(rest) },
    );
  }
}