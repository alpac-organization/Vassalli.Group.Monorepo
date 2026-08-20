import { Button, Dropdown, InputText } from "@alpac/design-system";
import type { Option } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { WarehouseTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import {
  EMPTY_WAREHOUSE_FILTERS,
  type WarehouseFilters,
} from "@app/modules/warehouse/ui/view/warehouse/types/warehouse.types";
import type { WarehouseFiltersProps } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/types/warehouse-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/utils/styles";

const WAREHOUSE_TYPE_FILTER_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  ...WarehouseTypeOptions.map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
];

const STATUS_FILTER_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  { value: "Activa", label: "Activa" },
  { value: "Inactiva", label: "Inactiva" },
];

function buildFiltersPayload(values: WarehouseFilters): WarehouseFilters {
  return {
    warehouse_code: values.warehouse_code.trim(),
    warehouse_type: values.warehouse_type,
    filterStatus: values.filterStatus,
  };
}

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
                placeholder="Todos"
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

        <div className="flex flex-col min-w-0">
          <Controller
            name="filterStatus"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Estado"
                placeholder="Todos"
                options={STATUS_FILTER_OPTIONS}
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
          <Button
            type="submit"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
}
