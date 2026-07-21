import type { GetUnitMeasurementRequest } from "@app/modules/unit-of-measurement/domain/requests/get-unit-measurement";
import type { GetUnitMeasurementsResponse } from "@app/modules/unit-of-measurement/domain/responses/get-unit-measurements";
export interface IUnitMeasurementServices {
  getUnitMeasurements(
    request: GetUnitMeasurementRequest,
  ): Promise<GetUnitMeasurementsResponse[]>;
}
