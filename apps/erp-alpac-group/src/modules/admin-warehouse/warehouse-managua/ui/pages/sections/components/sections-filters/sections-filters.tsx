import { Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import {
  EMPTY_SECTION_FILTERS,
  type SectionFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";
import type { SectionsFiltersProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/types/sections-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/utils/styles";
import {
  buildFiltersPayload,
  SECTION_TYPE_FILTER_OPTIONS,
  STORAGE_TYPE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-filters/utils/section-filters.util";
import { FilterActions } from "@app/shared/components/filters/filter-actions/filter-actions";
import { StatusFilterDropdown } from "@app/shared/components/filters/status-filter-dropdown/filter-dropdown";

export function SectionsFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_SECTION_FILTERS,
}: SectionsFiltersProps) {
  const { register, handleSubmit, control, reset } = useForm<SectionFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_SECTION_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por código, tipo, almacenamiento o estado
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => {
          onApply(buildFiltersPayload(values));
        })}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 items-end"
      >
        <div className="flex flex-col min-w-0">
          <InputText
            label="Código"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por código..."
            {...register("searchTerm")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="filterType"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Tipo"
                placeholder="Seleccionar tipo"
                options={SECTION_TYPE_FILTER_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="filterStorage"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Almacenamiento"
                placeholder="Selec. almacenamiento"
                options={STORAGE_TYPE_FILTER_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <StatusFilterDropdown
          control={control}
          options={STATUS_FILTER_OPTIONS}
          inputClassName={inputClassName}
          labelClassName={labelClassName}
        />

        <FilterActions onClear={handleClear} />
      </form>
    </div>
  );
}
