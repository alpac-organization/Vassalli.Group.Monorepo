export type FaultsFilterFormValues = {
  code: string;
  severity: string;
  status: string;
  source: string;
};

export type FaultsFiltersProps = {
  onApply: (values: FaultsFilterFormValues) => void;
  onClear: () => void;
  canWrite?: boolean;
  onRegisterFault?: () => void;
};
