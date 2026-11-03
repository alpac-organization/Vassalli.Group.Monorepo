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
      <div className="flex w-full flex-wrap items-start gap-4 lg:flex-1 lg:gap-6">
        <div className="w-full sm:w-64">
          <InputText
            label="Codigo"
            placeholder="SI-00001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("code")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Area de trabajo"
            placeholder="Work area ID"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("work_area_id")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Almacen"
            placeholder="Warehouse ID"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("warehouse_id")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Sucursal"
            placeholder="Branch ID"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("branch_id")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Orden operativa"
            placeholder="Operational order ID"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("operational_order_id")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Solicitado por"
            placeholder="User ID"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("requested_by_user_id")}
          />
        </div>

        <div className="w-full sm:w-64">
          <Controller
            name="reason_use"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Motivo"
                value={field.value}
                options={[
                  { value: "Sale", label: "Venta" },
                  { value: "Operation", label: "Operación" },
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
