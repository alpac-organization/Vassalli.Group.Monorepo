import type {
  VacationStatusFilterValue,
  PermissionTypeFilterValue,
} from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
export type PermissionFiltersBarProps = {
  filterDraft: VacationStatusFilterValue;
  onFilterDraftChange: (value: VacationStatusFilterValue) => void;
  typeDraft: PermissionTypeFilterValue;
  onTypeDraftChange: (value: PermissionTypeFilterValue) => void;
  onApply: () => void;
  onClear: () => void;
};
