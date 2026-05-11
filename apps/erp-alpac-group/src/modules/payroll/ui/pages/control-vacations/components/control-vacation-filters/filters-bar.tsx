import { InputText, Dropdown, Button } from "@alpac/design-system";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useCallback } from "react";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { ControlVacationFiltersBarProps } from "./types/control-vacation-filter-bar";

type VacationFilterFields = {
  identification_number: string;
  work_area: number;
};

const defaultFormValues: VacationFilterFields = {
  identification_number: "",
  work_area: 0,
};

export function ControlVacationFiltersBar({
  onApply,
  onClear,
  isApplyingFilters = false,
}: ControlVacationFiltersBarProps) {
  const { companyId } = useUserStore();

  const { register, handleSubmit, control, reset } =
    useForm<VacationFilterFields>({
      defaultValues: defaultFormValues,
    });

  const { GetCatalogListQuery: workAreasQuery } = useCatalog({
    company_id: companyId,
    catalog_type_id: CatalogEnum.WORK_AREAS,
  });

  const { data: workAreas = [] } = workAreasQuery;
  const optionsWorkAreas = mapCatalogToOptions(workAreas);

  const onSubmit: SubmitHandler<VacationFilterFields> = (data) => {
    onApply({
      identification_number: data.identification_number,
      work_area_id: data.work_area || undefined,
    });
  };

  const handleClearFilters = useCallback(() => {
    reset(defaultFormValues);
    onClear();
  }, [reset, onClear]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-t border-t-slate-600 pt-4 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Elija filtros y aplique para cargar. Limpiar deja los campos vacíos.
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
      >
        <div className="flex flex-col">
          <InputText
            label="Identificación"
            className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-white"
            labelClassName="text-black! dark:text-white!"
            type="text"
            placeholder="Ingrese la identificación"
            {...register("identification_number", {
              setValueAs: (value: string) =>
                value ? value.toString().replace(/-/g, "").toUpperCase() : "",
              required: false,
              onChange: (e) => {
                e.target.value = formatIdentificationNumber(e.target.value);
              },
            })}
          />
        </div>

        <div className="flex flex-col">
          <Controller
            name="work_area"
            control={control}
            rules={{
              required: false,
            }}
            render={({ field }) => {
              return (
                <Dropdown
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Área de trabajo"
                  placeholder="Seleccione un área de trabajo"
                  appearance="dark"
                  labelClassName="text-black! dark:text-white!"
                  valueClassName="text-black! dark:text-white!"
                  className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  options={optionsWorkAreas ?? []}
                />
              );
            }}
          />
        </div>

        <div className="flex flex-col">
          <Button
            type="submit"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
            isLoading={isApplyingFilters}
            disabled={isApplyingFilters}
          />
        </div>

        <div className="flex flex-col">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClearFilters}
            disabled={isApplyingFilters}
          />
        </div>
      </form>
    </div>
  );
}
