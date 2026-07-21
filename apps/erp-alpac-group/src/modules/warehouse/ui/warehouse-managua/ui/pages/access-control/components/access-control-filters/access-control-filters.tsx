import { Button, InputText } from "@alpac/design-system";
import { useForm } from "react-hook-form";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { AccessControlFiltersProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/types/access-control.types";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

const EMPTY_FILTERS: AccessControlFilters = {
  ducat_number: "",
  plate_number: "",
  driver_name: "",
};

export function AccessControlFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_FILTERS,
}: AccessControlFiltersProps) {
  const { register, handleSubmit, reset } = useForm<AccessControlFilters>({
    defaultValues,
    mode: "onChange",
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
            Filtra por Num.Ducat, placa o conductor de vehiculo para la busqueda
            de unidades en el plantel.
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onApply)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end"
      >
        <div className="flex flex-col min-w-0">
          <InputText
            label="Número DUCA"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Ingrese número DUCA"
            errorVariant="tooltip"
            {...register("ducat_number")}
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
