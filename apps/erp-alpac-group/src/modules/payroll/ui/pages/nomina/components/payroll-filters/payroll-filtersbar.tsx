import { InputText, Dropdown, Button } from "@alpac/design-system";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useCallback } from "react";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/collaborator.request";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import { CatalogEnum } from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import { useUserStore } from "@app/shared/stores/useUserStore";

type PayrollCollaboratorFilterFields = Pick<
  CollaboratorRequest,
  "identification_number"
> & { work_area: number; job_position: number };

type PayrollFiltersBarProps = {
  onApply: (filters: PayrollCollaboratorFilterFields) => void;
  onClear: () => void;
};

const defaultFormValues: PayrollCollaboratorFilterFields = {
  identification_number: "",
  work_area: 0,
  job_position: 0,
};

export default function PayrollFiltersBar({
  onApply,
  onClear,
}: PayrollFiltersBarProps) {
  const { companyId } = useUserStore();

  const { register, handleSubmit, control, reset } =
    useForm<PayrollCollaboratorFilterFields>({
      defaultValues: defaultFormValues,
    });

  const { GetCatalogListQuery: workAreasQuery } = useCatalog({
    company_id: companyId,
    catalog_type_id: CatalogEnum.WORK_AREAS,
  });
  const { GetCatalogListQuery: jobPositionsQuery } = useCatalog({
    company_id: companyId,
    catalog_type_id: CatalogEnum.JOB_POSITIONS,
  });

  const { data: workAreas = [] } = workAreasQuery;
  const { data: jobPositions = [] } = jobPositionsQuery;
  const optionsWorkAreas = mapCatalogToOptions(workAreas);
  const optionsJobPositions = mapCatalogToOptions(jobPositions);
  const onSubmit: SubmitHandler<PayrollCollaboratorFilterFields> = (data) => {
    onApply(data);
  };

  const handleClearFilters = useCallback(() => {
    reset(defaultFormValues);
    onClear();
  }, [reset, onClear]);

  return (
    <div>
      <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end"
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
          <Controller
            name="job_position"
            control={control}
            rules={{
              required: false,
            }}
            render={({ field }) => {
              return (
                <Dropdown
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Posición"
                  placeholder="Seleccione una posición de trabajo"
                  appearance="dark"
                  labelClassName="text-black! dark:text-white!"
                  valueClassName="text-black! dark:text-white!"
                  className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  options={optionsJobPositions ?? []}
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
          />
        </div>

        <div className="flex flex-col sm:col-span-2 lg:col-span-1">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClearFilters}
          />
        </div>
      </form>
    </div>
  );
}
