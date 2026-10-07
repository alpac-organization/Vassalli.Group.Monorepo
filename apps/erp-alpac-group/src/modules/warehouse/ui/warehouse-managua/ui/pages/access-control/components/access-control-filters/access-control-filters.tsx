import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { AccessControlFiltersProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/types/access-control.types";
import {
  buildFiltersPayload,
  DOCUMENT_TYPE_OPTIONS,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/utils/utils";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/utils/styles";

const EMPTY_FILTERS: AccessControlFilters = {
  document_number: "",
  document_type: "",
  vehicle_plate_number: "",
  container_number: "",

};

export function AccessControlFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_FILTERS,
}: AccessControlFiltersProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<AccessControlFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_FILTERS);
    onClear();
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por tipo de documento, número de placa, número de contenedor.
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
          <Controller
            name="document_type"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Tipo de documento"
                placeholder="Todos"
                options={DOCUMENT_TYPE_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => {
                  const raw =
                    typeof value === "object" && value !== null && "value" in value
                      ? String((value as { value: unknown }).value)
                      : String(value ?? "");
                  field.onChange(raw);
                }}
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <InputText
            label="Número de placa"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por placa..."
            errorVariant="tooltip"
            {...register("vehicle_plate_number")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <InputText
            label="Número de contenedor"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por contenedor..."
            errorVariant="tooltip"
            {...register("container_number")}
          />
        </div>

        <div className="flex flex-row gap-4 min-w-0 w-full items-end self-end">
          <Button
            type="submit"
            size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
          />
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
