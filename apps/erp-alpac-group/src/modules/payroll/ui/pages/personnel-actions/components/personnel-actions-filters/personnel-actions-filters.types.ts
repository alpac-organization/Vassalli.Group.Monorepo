import type { DatePickerValue } from "@alpac/design-system";

export type PersonnelActionsFilterValues = {
  status: string;
  scope: string;
  start_date: string | null;
  end_date: string | null;
};

export type InternalPersonnelActionsFilterForm = {
  status: string;
  scope: string;
  start_date: DatePickerValue | null;
  end_date: DatePickerValue | null;
};

export interface PersonnelActionsFiltersProps {
  onApply: (values: PersonnelActionsFilterValues) => void;
  onClear: () => void;
  isLoading?: boolean;
}
