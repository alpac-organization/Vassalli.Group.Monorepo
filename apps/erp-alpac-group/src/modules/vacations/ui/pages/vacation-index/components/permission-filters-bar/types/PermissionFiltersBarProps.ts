import type {
  VacationStatusFilterValue,
  PermissionTypeFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
export type PermissionFiltersBarProps = {
  filterDraft: VacationStatusFilterValue;
  onFilterDraftChange: (value: VacationStatusFilterValue) => void;
  typeDraft: PermissionTypeFilterValue;
  onTypeDraftChange: (value: PermissionTypeFilterValue) => void;
  onApply: () => void;
  onClear: () => void;
};
