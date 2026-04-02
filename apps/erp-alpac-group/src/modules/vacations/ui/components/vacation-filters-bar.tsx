import { Button, Dropdown } from "@alpac/design-system";
import type { VacationStatusFilterValue } from "@app/modules/vacations/domain/types/vacation-request.types";
import { VACATION_STATUS_FILTER_OPTIONS } from "@app/modules/vacations/ui/constants/vacation-filters.constants";

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
      <div className="flex flex-col gap-4">
        <div className="w-full md:max-w-md">
          <Dropdown
            label="Estado"
            placeholder="Todos los estados"
            value={filterDraft}
            onChange={(v) => onFilterDraftChange(v as VacationStatusFilterValue)}
            options={VACATION_STATUS_FILTER_OPTIONS}
            labelClassName={labelClassName}
            valueClassName={valueClassName}
            className={dropdownClassName}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Limpiar filtros"
            onClick={onClear}
            className="w-full sm:w-auto! text-[15px]! rounded-md! bg-white! text-neutral-900! border! border-neutral-900! dark:bg-transparent! dark:text-white! dark:border-neutral-400!"
          />
          <Button
            type="button"
            size="giant"
            label="Aplicar filtros"
            onClick={onApply}
            className="w-full sm:w-auto! text-[15px]! rounded-md! text-white! bg-neutral-900! hover:bg-neutral-800! dark:bg-neutral-100! dark:text-neutral-900!"
          />
        </div>
      </div>
    </div>
  );
}
