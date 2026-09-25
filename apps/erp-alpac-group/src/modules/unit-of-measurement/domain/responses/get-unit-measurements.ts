import { UnitMeasurementEnum } from "@app/core/enums/unit-measurements";

export type UnitMeasureTypeValue =
  (typeof UnitMeasurementEnum)[keyof typeof UnitMeasurementEnum]["value"];

export interface GetUnitMeasurementsResponse {
  unit_measure_id: string;
  code: string;
  name: string;
  symbol: string;
  description: string | null;
  type: UnitMeasureTypeValue;
}
