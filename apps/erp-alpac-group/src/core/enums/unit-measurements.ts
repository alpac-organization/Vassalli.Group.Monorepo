import type { EnumType } from "@app/shared/types/enum.type";

export const UnitMeasurementEnum = {
  Weight: { value: 1, label: "Peso" },
  Volume: { value: 2, label: "Volumen" },
  Length: { value: 3, label: "Longitud" },
  Area: { value: 4, label: "Area" },
  Unit: { value: 5, label: "Unidad" },
  Time: { value: 6, label: "Tiempo" },
};
export type UnitMeasurementType =
  (typeof UnitMeasurementEnum)[keyof typeof UnitMeasurementEnum];
export const UnitMeasurementOptions: EnumType[] =
  Object.values(UnitMeasurementEnum);
