import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Filter, FilterX } from "lucide-react";
import { Button, Dropdown, InputText } from "@alpac/design-system";

import { inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import type { FuelRequestsFilters, FuelRequestsSectionFiltersProps } from "./fuel-requests-section-filters.types";

export const FuelRequestsSectionFilters = function (props: FuelRequestsSectionFiltersProps) {
  const { register, control, handleSubmit, reset, setValue, formState: { isDirty } } =
    useForm<FuelRequestsFilters>({
      defaultValues: props.filters,
    });

  useEffect(() => {
    reset(props.filters);
  }, [props.filters, reset]);

  const handleClear = () => {
    reset({
      page_number: 1,
      page_size: 10,
    });
    setValue("code", "", { shouldDirty: false });
    setValue("machinery_id", "", { shouldDirty: false });
    setValue("status", undefined, { shouldDirty: false });

    props.onClear();
  };

  const onSubmit = (values: FuelRequestsFilters) => {
    props.onApply(values);
    reset(values);
  };

  return (
    <form
      className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-4 md:flex-row md:flex-nowrap md:items-end md:gap-6">
        <div className="w-full md:w-44 md:shrink-0">
          <InputText
            label="Código de solicitud"
            placeholder="FR-ALP-MGA-001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("code")}
          />
        </div>

        <div className="w-full md:w-44 md:shrink-0 block md:hidden">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Estado"
                value={field.value}
                options={[
                  { value: "PendingReview", label: "Pendiente revisión" },
                  { value: "Approved", label: "Aprobado" },
                  { value: "Annuled", label: "Anulado" },
                  { value: "PendingDispatch", label: "Pendiente despacho" },
                  { value: "DispatchCancelled", label: "Despacho cancelado" },
                ]}
                onChange={(e: any) => field.onChange(e?.target?.value ?? e)}
                placeholder="Todos"
                appearance="dark"
                labelClassName={labelClassName}
                className={inputClassName}
              />
            )}
          />
        </div>

        <div className="w-full md:w-72 md:shrink-0">
          <Controller
            name="machinery_id"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Maquinaria / Vehículo"
                value={field.value}
                options={[{ value: "", label: "Todos" }, ...(props.machineryOptions ?? [])]}
                onChange={(e: any) => field.onChange(e?.target?.value ?? e)}
                placeholder={props.isMachineryLoading ? "Cargando..." : "Todos"}
                appearance="dark"
                labelClassName={labelClassName}
                className={inputClassName}
                disabled={props.isMachineryLoading}
              />
            )}
          />
        </div>
      </div>

      <section className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5">
        <Button
          icon={<Filter size={15} />}
          type="submit"
          size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          label="Aplicar filtros"
          disabled={!isDirty}
        />
        <Button
          icon={<FilterX size={15} />}
          type="button"
          size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
          label="Limpiar filtros"
          onClick={handleClear}
        />
      </section>
    </form>
  );
};