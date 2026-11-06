import type { DatePickerValue } from "@alpac/design-system";

export type AbsencesFilterFormValues = {
  identification_number: string;
  status: string;
  source: string;
  start_date: string;
  end_date: string;
};

export type InternalFilterFormValues = {
  identification_number: string;
  status: string;
  source: string;
  start_date: DatePickerValue | null;
  end_date: DatePickerValue | null;
};

export type AbsencesFiltersProps = {
  onApply: (values: AbsencesFilterFormValues) => void;
  onClear: () => void;
  canWrite?: boolean;
  onRegisterAbsence?: () => void;
};
