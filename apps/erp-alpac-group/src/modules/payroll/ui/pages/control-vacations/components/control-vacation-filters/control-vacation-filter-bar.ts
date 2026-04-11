import type { ControlVacationStatusFilterValues } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
export type ControlVacationFiltersBarProps = {
  filterDraft: ControlVacationStatusFilterValues;
  onFilterDraftChange: (value: ControlVacationStatusFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
};
