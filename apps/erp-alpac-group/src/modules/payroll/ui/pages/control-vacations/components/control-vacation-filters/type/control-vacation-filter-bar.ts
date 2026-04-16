export type ControlVacationFiltersBarProps = {
  initialStart: string | null;
  initialEnd: string | null;
  onApply: (range: { start_date: string; end_date: string }) => void;
  onClear: () => void;
};
