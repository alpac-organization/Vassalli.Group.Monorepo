export interface ControlVacationFiltersBarProps {
  onApply: (filters: { identification_number?: string; work_area_id?: number }) => void;
  onClear: () => void;
  isApplyingFilters?: boolean;
}
