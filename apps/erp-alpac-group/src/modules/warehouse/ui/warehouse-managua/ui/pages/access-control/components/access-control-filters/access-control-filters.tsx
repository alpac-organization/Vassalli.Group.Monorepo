import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { AccessControlFiltersProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/types/access-control.types";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const EMPTY_FILTERS: AccessControlFilters = {
  ducaNumero: "",
  placaCabezal: "",
  conductor: "",
};

export function AccessControlFiltersBar({
  plateOptions,
  conductorOptions,
  onApply,
  onClear,
  defaultValues = EMPTY_FILTERS,
}: AccessControlFiltersProps) {
  const { register, handleSubmit, control, reset } =
    useForm<AccessControlFilters>({
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
            {...register("ducaNumero")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="placaCabezal"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="Número de placa"
                placeholder="Buscar por placa..."
                appearance="dark"
                labelClassName={labelClassName}
                valueClassName="text-black! dark:text-white!"
                className={dropdownClassName}
                options={plateOptions}
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="conductor"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="Conductor"
                placeholder="Buscar por conductor..."
                appearance="dark"
                labelClassName={labelClassName}
                valueClassName="text-black! dark:text-white!"
                className={dropdownClassName}
                options={conductorOptions}
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
