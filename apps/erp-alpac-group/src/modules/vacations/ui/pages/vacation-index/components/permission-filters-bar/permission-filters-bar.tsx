import { Button, Dropdown } from "@alpac/design-system";
import {
  VACATION_STATUS_FILTER_OPTIONS,
  PERMISSION_TYPE_FILTER_OPTIONS,
} from "@app/modules/vacations/ui/pages/vacation-index/constants/permission-filters.constants";
import type { PermissionFiltersBarProps } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-filters-bar/types/PermissionFiltersBarProps";
import type {
  VacationStatusFilterValue,
  PermissionTypeFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const valueClassName = "text-black! dark:text-white!";

export function PermissionFiltersBar({
  filterDraft,
  onFilterDraftChange,
  typeDraft,
  onTypeDraftChange,
  onApply,
  onClear,
}: PermissionFiltersBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
      <div className="flex flex-col">
        <Dropdown
          appearance="dark"
          placeholder="Todos los estados"
          value={filterDraft}
          onChange={(v) =>
            onFilterDraftChange(v as VacationStatusFilterValue)
          }
          options={VACATION_STATUS_FILTER_OPTIONS}
          labelClassName={labelClassName}
          valueClassName={valueClassName}
          className={dropdownClassName}
        />
      </div>
      <div className="flex flex-col">
        <Dropdown
          appearance="dark"
          placeholder="Todos los tipos"
          value={typeDraft}
          onChange={(v) =>
            onTypeDraftChange(v as PermissionTypeFilterValue)
          }
          options={PERMISSION_TYPE_FILTER_OPTIONS}
          labelClassName={labelClassName}
          valueClassName={valueClassName}
          className={dropdownClassName}
        />
      </div>
      <div className="flex flex-col">
        <Button
          type="button"
          size="giant"
          label="Aplicar filtros"
          onClick={onApply}
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        />
      </div>
      <div className="flex flex-col">
        <Button
          type="button"
          size="giant"
          label="Limpiar filtros"
          onClick={onClear}
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
        />
      </div>
    </div>
  );
}
