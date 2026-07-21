import type { UnitMeasurementType } from "@app/core/enums/unit-measurements";

export interface GetUnitMeasurementsResponse {
  unit_measure_id: string;
  code: string;
  name: string;
  symbol: string;
  description: string;
  type: UnitMeasurementType;
}
