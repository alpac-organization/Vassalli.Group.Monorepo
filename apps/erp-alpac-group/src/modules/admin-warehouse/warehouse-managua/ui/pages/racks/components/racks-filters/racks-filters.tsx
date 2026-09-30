import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import {EMPTY_RACK_FILTERS,type RackFilters,} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";
import type { RacksFiltersProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/types/racks-filters.types";
import {inputClassName,labelClassName,} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/utils/styles";
import {buildFiltersPayload,STATUS_FILTER_OPTIONS,USAGE_FILTER_OPTIONS,} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/utils/rack-filters-util";
import { StatusFilterDropdown } from "@app/shared/components/filters/status-filter-dropdown/filter-dropdown";

export function RacksFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_RACK_FILTERS,
}: RacksFiltersProps) {
  const { register, handleSubmit, control, reset } = useForm<RackFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_RACK_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col rounded-lg border border-slate-600 bg-white p-3 hover:border-neutral-600 dark:bg-[#272b34] w-full min-w-0">
      <form
        onSubmit={handleSubmit((values) => {
          onApply(buildFiltersPayload(values));
        })}
        className="flex flex-wrap items-end gap-3 w-full min-w-0"
      >
        <div className="flex-1 min-w-[110px] sm:min-w-[140px]">
          <InputText
            label="Nivel"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Ej: 1, 2..."
            {...register("level")}
          />
        </div>

        <div className="flex-1 min-w-[150px] sm:min-w-[180px]">
          <StatusFilterDropdown
            control={control}
            name="status"
            options={STATUS_FILTER_OPTIONS}
            inputClassName={inputClassName}
            labelClassName={labelClassName}
            placeholder="Todos"
          />
        </div>

        <div className="flex-1 min-w-[160px] sm:min-w-[200px]">
          <Controller
            name="usage"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Perfil de uso"
                placeholder="Todos"
                options={USAGE_FILTER_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="submit"
            size="giant"
            className="text-[14px]! h-[42px]! sm:h-[46px]! px-5! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Filtrar"
          />
          <Button
            type="button"
            size="giant"
            className="text-[14px]! h-[42px]! sm:h-[46px]! px-4! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
}

