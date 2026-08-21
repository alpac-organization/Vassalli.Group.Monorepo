import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import {
  EMPTY_RACK_FILTERS,
  type RackFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";
import type { RacksFiltersProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/types/racks-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/utils/styles";
import {
  buildFiltersPayload,
  STATUS_FILTER_OPTIONS,
  USAGE_FILTER_OPTIONS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/utils/rack-filters-util";

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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por nivel, estado o perfil de uso
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
            label="Nivel"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Número de nivel..."
            {...register("level")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="status"
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
