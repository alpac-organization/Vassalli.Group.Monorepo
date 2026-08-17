import type { DatePickerValue, TimePickerValue } from "@alpac/design-system";

export type RegisterDucatGeneralFormValues = {
  container_number: string;
  empresa: string;
  general_observations: string;
  is_in_transit: boolean;
  registered_start_date: DatePickerValue | null;
  registered_start_time: TimePickerValue | null;
};

export type RegisterDucatGeneralFormProps = {
  reception_id: string;
  company_id: string;
  module_code: string;
  defaultContainerNumber: string;
  initialStartDate: DatePickerValue | null;
  initialStartTime: TimePickerValue | null;
};