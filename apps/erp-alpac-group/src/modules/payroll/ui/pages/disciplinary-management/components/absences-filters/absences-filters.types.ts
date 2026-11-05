export type AbsencesFilterFormValues = {
  identification_number: string;
  status: string;
  source: string;
  start_date: string;
  end_date: string;
};

export type AbsencesFiltersProps = {
  onApply: (values: AbsencesFilterFormValues) => void;
  onClear: () => void;
  canWrite?: boolean;
  onRegisterAbsence?: () => void;
};
