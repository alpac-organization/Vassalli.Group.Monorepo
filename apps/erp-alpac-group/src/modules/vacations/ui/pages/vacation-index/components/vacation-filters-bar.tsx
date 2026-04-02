import { Button, Dropdown } from "@alpac/design-system";
import type { VacationStatusFilterValue } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-request.types";
import { VACATION_STATUS_FILTER_OPTIONS } from "@app/modules/vacations/ui/pages/vacation-index/constants/vacation-filters.constants";

type VacationFiltersBarProps = {
  filterDraft: VacationStatusFilterValue;
  onFilterDraftChange: (value: VacationStatusFilterValue) => void;
  onApply: () => void;
  onClear: () => void;
};

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const valueClassName = "text-black! dark:text-white!";

export function VacationFiltersBar({
  filterDraft,
  onFilterDraftChange,
  onApply,
  onClear,
}: VacationFiltersBarProps) {
  return (
    <div className="rounded-lg border border-slate-600 dark:border-neutral-600 bg-white dark:bg-[#272b34] p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 md:max-w-xl md:flex-1">
          <div className="min-w-0 flex-1 sm:max-w-md">
            <Dropdown
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
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end md:w-auto">
          <Button
            type="button"
            size="giant"
            label="Limpiar filtros"
            onClick={onClear}
            className="w-full sm:w-auto! text-[15px]! rounded-md! hover:bg-neutral-800! dark:bg-blue-600! text-white!"
          />
          <Button
            type="button"
            size="giant"
            label="Aplicar filtros"
            onClick={onApply}
            className="w-full sm:w-auto! text-[15px]! rounded-md! hover:bg-neutral-800! dark:bg-blue-600! text-white!"
          />
        </div>
      </div>
    </div>
  );
}
