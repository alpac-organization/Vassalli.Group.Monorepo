import type { DatePickerValue } from "@alpac/design-system";

export type AccessControlFilters = {
  ducat_number: string;
  plate_number: string;
  driver_name: string;
  date: DatePickerValue | null;
};

export type AccessControlMetrics = {
  totalIngresos: number;
  totalesEnPlanta: number;
  totalDespachados: number;
};
