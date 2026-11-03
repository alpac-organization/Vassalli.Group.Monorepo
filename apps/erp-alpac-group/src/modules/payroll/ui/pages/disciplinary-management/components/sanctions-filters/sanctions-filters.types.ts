export type SanctionsFilterFormValues = {
  sanction_type: string;
  sanction_status: string;
};

export type SanctionsFiltersProps = {
  onApply: (values: SanctionsFilterFormValues) => void;
  onClear: () => void;
};
