import { Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import {
  EMPTY_WAREHOUSE_FILTERS,
  type WarehouseFilters,
} from "@app/modules/warehouse/ui/view/warehouse/types/warehouse.types";
import type { WarehouseFiltersProps } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/types/warehouse-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/utils/styles";
import {
  buildFiltersPayload,
  WAREHOUSE_TYPE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/utils/warehouse-filters";
import { FilterActions } from "@app/shared/components/filters/filter-actions/filter-actions";
import { StatusFilterDropdown } from "@app/shared/components/filters/status-filter-dropdown/filter-dropdown";

export function WarehouseFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_WAREHOUSE_FILTERS,
}: WarehouseFiltersProps) {
  const { register, handleSubmit, control, reset } = useForm<WarehouseFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_WAREHOUSE_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por código, tipo o estado de la bodega
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((values) => {
          onApply(buildFiltersPayload(values));
        })}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end"
      >
        <div className="flex flex-col min-w-0">
          <InputText
            label="Código"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por código..."
            {...register("warehouse_code")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="warehouse_type"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Tipo"
                placeholder="Seleccione un tipo"
                options={WAREHOUSE_TYPE_FILTER_OPTIONS}
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
          placeholder="Seleccione un estado"
        />

        <FilterActions onClear={handleClear} />
      </form>
    </div>
  );
}
