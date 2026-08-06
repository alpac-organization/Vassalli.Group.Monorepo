import type { DatePickerValue } from "@alpac/design-system";

export type AccessControlFilters = {
  document_number: string;
  document_type: string;
  plate_number: string;
  driver_name: string;
  start_date: DatePickerValue | null;
  end_date: DatePickerValue | null;
};

export type AccessControlMetrics = {
  totalIngresos: number;
  totalesEnPlanta: number;
  totalDespachados: number;
};
