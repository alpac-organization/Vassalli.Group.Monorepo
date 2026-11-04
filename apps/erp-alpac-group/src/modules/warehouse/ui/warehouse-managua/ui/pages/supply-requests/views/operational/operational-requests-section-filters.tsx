import { Filter, FilterX } from "lucide-react";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";

import { inputClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import { DEFAULT_OPERATIONAL_FILTERS } from "./operational-requests.types";

import type { OperationalRequestsFilters } from "./operational-requests.types";
import type { OperationalRequestsSectionFiltersProps } from "./operational-requests-section-filters.types";

export const OperationalRequestsSectionFilters = function (
  props: OperationalRequestsSectionFiltersProps,
) {
  const { register, control, handleSubmit, reset, formState: { isDirty } } =
    useForm<OperationalRequestsFilters>({
      defaultValues: props.filters,
    });

  const onSubmit = (values: OperationalRequestsFilters) => {
    props.onApply(values);
    reset(values);
  };

  const handleClear = () => {
    reset(DEFAULT_OPERATIONAL_FILTERS);
    props.onClear();
  };

  return (
    <form
      className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-col gap-4 md:flex-row md:flex-nowrap md:items-end md:gap-6">
        <div className="w-full md:w-44 md:shrink-0">
          <InputText
            label="Codigo de solicitud"
            placeholder="OR-ALP-MGA-001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("code")}
          />
        </div>

        <div className="w-full md:w-44 md:shrink-0">
          <InputText
            label="Codigo de PO"
            placeholder="PO-01"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("po_code")}
          />
        </div>

        {/* Sucursal temporalmente oculta
        <div className="w-full md:w-44 md:shrink-0">
          <Controller
            name="branch_id"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Sucursal"
                value={field.value}
                options={[
                  { value: "", label: "Todos" },
                  ...(props.branchOptions ?? []),
                ]}
                onChange={(e) => {
                  field.onChange(e);
                }}
                placeholder={props.isBranchesLoading ? "Cargando..." : "Todos"}
                appearance="dark"
                labelClassName={labelClassName}
                className={inputClassName}
                disabled={props.isBranchesLoading}
              />
            )}
          />
        </div>
        */}

        <div className="w-full md:w-44 md:shrink-0">
          <Controller
            name="reason_use"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Motivo de solicitud"
                value={field.value}
                options={[
                  { value: "Sale", label: "Venta" },
                  { value: "Operation", label: "Operativo" },
                ]}
                onChange={(e) => {
                  field.onChange(e);
                }}
                placeholder="Todos"
                appearance="dark"
                labelClassName={labelClassName}
                className={inputClassName}
              />
            )}
          />
        </div>

        <div className="block md:hidden w-full md:w-44 md:shrink-0">
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
                onChange={(e) => {
                  field.onChange(e);
                }}
                placeholder="Todos"
                appearance="dark"
                labelClassName={labelClassName}
                className={inputClassName}
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
