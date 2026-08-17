import type { DatePickerValue, TimePickerValue } from "@alpac/design-system";

export type RegisterDucatDetailFormValues = {
  merchandise_id: string;
  total_bultos: string;
  total_weight: string;
  product_description: string;
  remitente: string;
  destination_area_observation: string;
  registered_start_date: DatePickerValue | null;
  registered_start_time: TimePickerValue | null;
};

export type RegisterDucatDetailFormProps = {
  reception_id: string;
  ducat_id: string;
  company_id: string;
  module_code: string;
  ducatNumber: string;
  initialStartDate: DatePickerValue | null;
  initialStartTime: TimePickerValue | null;
};