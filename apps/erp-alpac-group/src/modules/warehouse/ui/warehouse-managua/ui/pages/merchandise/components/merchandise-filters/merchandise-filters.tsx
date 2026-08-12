import { Button, Dropdown, InputText } from "@alpac/design-system";
import type { Option } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { DocumentEnum } from "@app/core/enums/document.enum";
import {
  EMPTY_MERCHANDISE_FILTERS,
  type MerchandiseFilters,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/types/merchandise.types";
import type { MerchandiseFiltersProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-filters/types/merchandise-filters.types";
import {
  inputClassName,
  labelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-filters/utils/styles";

const DOCUMENT_TYPE_OPTIONS: Option[] = [
  { value: "DUCA", label: DocumentEnum.DUCA.label },
  {
    value: "CustomsDeclaration",
    label: DocumentEnum.CustomsDeclaration.label,
  },
];

function buildFiltersPayload(values: MerchandiseFilters): MerchandiseFilters {
  return {
    service_order_code: values.service_order_code.trim(),
    document_type: values.document_type.trim(),
    plate_number: values.plate_number.trim(),
    driver_name: values.driver_name.trim(),
  };
}

export function MerchandiseFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_MERCHANDISE_FILTERS,
}: MerchandiseFiltersProps) {
  const { register, handleSubmit, control, reset } =
    useForm<MerchandiseFilters>({
      defaultValues,
      mode: "onSubmit",
    });

  const handleClear = () => {
    reset(EMPTY_MERCHANDISE_FILTERS);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por orden de servicio, tipo de documento, placa o conductor.
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
            label="Código de orden de servicio"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            errorVariant="tooltip"
            placeholder="Buscar orden de servicio"
            {...register("service_order_code")}
          />
        </div>

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
                onChange={(value) => field.onChange(String(value ?? ""))}
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
            {...register("plate_number")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <InputText
            label="Conductor"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Buscar por conductor..."
            errorVariant="tooltip"
            {...register("driver_name")}
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
