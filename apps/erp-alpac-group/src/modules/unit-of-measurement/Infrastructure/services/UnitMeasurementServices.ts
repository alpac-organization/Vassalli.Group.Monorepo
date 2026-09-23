import type { IHttpHandler } from "@app/core/ports";
import type { IUnitMeasurementServices } from "@app/modules/unit-of-measurement/application/interfaces/IUnitMeasurementServices";
import type { GetUnitMeasurementRequest } from "@app/modules/unit-of-measurement/domain/requests/get-unit-measurement";
import type { GetUnitMeasurementsResponse } from "@app/modules/unit-of-measurement/domain/responses/get-unit-measurements";
import { cleanParams } from "@app/shared/utils/object.utils";

export class UnitMeasurementServices implements IUnitMeasurementServices {
  private readonly httpHandler: IHttpHandler;

  constructor(httphandler: IHttpHandler) {
    this.httpHandler = httphandler;
  }

  async getUnitMeasurements(
    payload: GetUnitMeasurementRequest,
  ): Promise<GetUnitMeasurementsResponse[]> {
    const { companie_id, module_code, unit_measure_type } = payload;
    const url = `/companies/${companie_id}/modules/${module_code}/units-measurement`;
    return this.httpHandler.get<GetUnitMeasurementsResponse[]>(url, {
      params: cleanParams({ unit_measure_type }),
    });
  }
}
