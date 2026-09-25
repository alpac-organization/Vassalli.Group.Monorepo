import type { UnitMeasureTypeValue } from "@app/modules/unit-of-measurement/domain/responses/get-unit-measurements";

export interface GetUnitMeasurementRequest {
  companie_id: string;
  module_code: string;
  unit_measure_type?: UnitMeasureTypeValue;
}
