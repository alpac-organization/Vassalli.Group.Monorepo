import { useEffect } from "react";
import { Filter, FilterX } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import { DEFAULT_SALIDAS_FILTERS } from "./salidas.types";
import type { SalidasFilters } from "./salidas.types";
import type { SalidasSectionFiltersProps } from "./salidas-section-filters.types";

export const SalidasSectionFilters = function (props: SalidasSectionFiltersProps) {
  const { control, handleSubmit, reset, setValue, register, formState: { isDirty } } = useForm<SalidasFilters>({
    defaultValues: props.filters,
  });

  useEffect(() => {
    reset(props.filters);
  }, [props.filters, reset]);

  const onSubmit = (values: SalidasFilters) => {
    props.onApply(values);
    reset(values);
  };

  const handleClear = () => {
    reset(DEFAULT_SALIDAS_FILTERS);
    setValue("output_code", "", { shouldDirty: false });
    setValue("supply_request_code", "", { shouldDirty: false });
    setValue("fuel_request_code", "", { shouldDirty: false });
    setValue("reason_inventory_removal_id", "", { shouldDirty: false });
    setValue("request_type", "", { shouldDirty: false });
    setValue("status", null, { shouldDirty: false });
    props.onClear();
  };

  return (
    <form
      className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-wrap items-start gap-4 lg:flex-1 lg:gap-6">
        <div className="w-full sm:w-64">
          <InputText
            label="Código de salida"
            placeholder="IS-ALP-MGA-001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("output_code")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Código de solicitud"
            placeholder="SR-ALP-MGA-001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("supply_request_code")}
          />
        </div>

        <div className="w-full sm:w-64">
          <Controller
            name="request_type"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Tipo de solicitud"
                value={field.value}
                options={[
                  { value: "", label: "Todos" },
                  { value: "Supply", label: "Insumos" },
                  { value: "Fuel", label: "Combustibles" },
                ]}
                onChange={(e: unknown) => field.onChange(String((e as { target?: { value?: unknown } })?.target?.value ?? e))}
                placeholder="Todos"
                appearance="dark"
                labelClassName={labelClassName}
                className={dropdownClassName}
              />
            )}
          />
        </div>

        <div className="w-full sm:w-64 md:hidden">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Estado"
                value={field.value}
                options={[
                  { value: "", label: "Todos" },
                  { value: "OutputPending", label: "Pendiente" },
                  { value: "Dispatched", label: "Despachado" },
                  { value: "InProgress", label: "En proceso" },
                  { value: "Rejected", label: "Rechazado" },
                ]}
                onChange={(e: unknown) => field.onChange(String((e as { target?: { value?: unknown } })?.target?.value ?? e))}
                placeholder="Todos"
                appearance="dark"
                labelClassName={labelClassName}
                className={dropdownClassName}
              />
            )}
          />
        </div>
      </div>

      <section className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5">
        <div className="flex w-full flex-col sm:w-auto">
          <Button
            icon={<Filter size={15} />}
            type="submit"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
            disabled={!isDirty}
          />
        </div>

        <div className="flex w-full flex-col sm:w-auto">
          <Button
            icon={<FilterX size={15} />}
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClear}
          />
        </div>
      </section>
    </form>
  );
};