import type { IHttpHandler } from "@app/core/ports";
import type { IUnitMeasurementServices } from "@app/modules/unit-of-measurement/application/interfaces/IUnitMeasurementServices";
import type { GetUnitMeasurementRequest } from "@app/modules/unit-of-measurement/domain/requests/get-unit-measurement";
import type { GetUnitMeasurementsResponse } from "@app/modules/unit-of-measurement/domain/responses/get-unit-measurements";

export class UnitMeasurementServices implements IUnitMeasurementServices {
  private readonly httpHandler: IHttpHandler;
  constructor(httphandler: IHttpHandler) {
    this.httpHandler = httphandler;
  }
  public async getUnitMeasurements(
    payload: GetUnitMeasurementRequest,
  ): Promise<GetUnitMeasurementsResponse[]> {
    try {
      const { companie_id, module_code } = payload;
      const url = `companies/${companie_id}/modules/${module_code}/units-measurement`;
      const response =
        await this.httpHandler.get<GetUnitMeasurementsResponse[]>(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
