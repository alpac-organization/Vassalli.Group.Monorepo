import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import {
  EMPTY_TRAMO_FILTERS,
  type TramoFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";
import type { TramosFiltersProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-filters/types/tramos-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-filters/utils/styles";
import {
  buildFiltersPayload,
  STATUS_FILTER_OPTIONS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-filters/utils/tramos-filter.utils";

export function TramosFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_TRAMO_FILTERS,
}: TramosFiltersProps) {
  const { register, handleSubmit, control, reset } = useForm<TramoFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_TRAMO_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por código o estado
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
            name="filterStatus"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Estado"
                placeholder="Seleccionar estado"
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
