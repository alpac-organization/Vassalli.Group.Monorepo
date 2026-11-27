import { useEffect, useMemo } from "react";
import { Filter, FilterX } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import { DEFAULT_ENTRADAS_FILTERS } from "../../entradas.types";
import type { EntradasFilters } from "../../entradas.types";
import type { EntradasSectionFiltersProps } from "./entradas-section-filters.types";
import type { Option } from "@alpac/design-system";
import type { EntryStatus as EntryStatusEnum } from "@app/core/enums/entry-status.enum";

const ENTRY_STATUS_OPTIONS: Option[] = [
  { value: "", label: "Todos" },
  ...(Object.keys(EntryStatus) as EntryStatusEnum[]).map((status) => ({
    value: status,
    label: EntryStatus[status].label,
  })),
];

export const EntradasSectionFilters = function (props: EntradasSectionFiltersProps) {
  const { companyId, moduleCode, role } = useUserStore();
  const isAdministrator = role === RoleEnum.ADMINISTRATOR;
  const isManager = role === RoleEnum.MANAGER;
  const canFilterByArea = isAdministrator || isManager;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { isDirty },
  } = useForm<EntradasFilters>({
    defaultValues: props.filters,
  });

  const { GetBranchesQuery } = useCompanies({
    company_id: isAdministrator ? companyId : "",
  });

  const { GetAreasByCompany } = useAreas(
    {
      company_id: companyId,
      module_code: moduleCode,
    },
    { enabled: canFilterByArea },
  );

  const branchOptions = useMemo<Option[]>(
    () => [
      { value: "", label: "Todas" },
      ...(GetBranchesQuery.data ?? []).map((branch) => ({
        value: branch.branch_id,
        label: branch.branch_name,
      })),
    ],
    [GetBranchesQuery.data],
  );

  const areaOptions = useMemo<Option[]>(
    () => [
      { value: "", label: "Todas las áreas" },
      ...(GetAreasByCompany.data ?? []).map((area) => ({
        value: area.work_area_id,
        label: area.work_area_name,
      })),
    ],
    [GetAreasByCompany.data],
  );

  useEffect(() => {
    reset(props.filters);
  }, [props.filters, reset]);

  const onSubmit = (values: EntradasFilters) => {
    const sanitizedValues: EntradasFilters = {
      ...values,
      branch_id: isAdministrator ? values.branch_id || undefined : undefined,
      work_area_id: canFilterByArea ? values.work_area_id || undefined : undefined,
    };

    props.onApply(sanitizedValues);
    reset(sanitizedValues);
  };

  const handleClear = () => {
    reset(DEFAULT_ENTRADAS_FILTERS);
    setValue("branch_id", undefined, { shouldDirty: false });
    setValue("work_area_id", undefined, { shouldDirty: false });
    setValue("entry_code", "", { shouldDirty: false });
    setValue("purchase_request_code", "", { shouldDirty: false });
    setValue("entry_status", null, { shouldDirty: false });
    props.onClear();
  };

  return (
    <form
      className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex w-full flex-wrap items-start gap-4 lg:flex-1 lg:gap-6">
        {isAdministrator && (
          <div className="w-full sm:w-64">
            <Controller
              name="branch_id"
              control={control}
              render={({ field }) => (
                <Dropdown
                  isLoading={
                    GetBranchesQuery.isPending || GetBranchesQuery.isFetching
                  }
                  label="Sucursal"
                  value={field.value ?? ""}
                  options={branchOptions}
                  onChange={(value) =>
                    field.onChange(value ? String(value) : undefined)
                  }
                  placeholder="Todas"
                  appearance="dark"
                  labelClassName={labelClassName}
                  className={dropdownClassName}
                />
              )}
            />
          </div>
        )}

        {canFilterByArea && (
          <div className="w-full sm:w-64">
            <Controller
              name="work_area_id"
              control={control}
              render={({ field }) => (
                <Dropdown
                  isLoading={
                    GetAreasByCompany.isPending || GetAreasByCompany.isFetching
                  }
                  label="Área de trabajo"
                  value={field.value ?? ""}
                  options={areaOptions}
                  onChange={(value) =>
                    field.onChange(value ? String(value) : undefined)
                  }
                  placeholder="Todas las áreas"
                  appearance="dark"
                  labelClassName={labelClassName}
                  className={dropdownClassName}
                />
              )}
            />
          </div>
        )}

        <div className="w-full sm:w-64">
          <InputText
            label="Código de entrada"
            placeholder="IE-ALP-MGA-001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("entry_code")}
          />
        </div>

        <div className="w-full sm:w-64">
          <InputText
            label="Código de solicitud de compra"
            placeholder="PR-ALP-MGA-001"
            className={inputClassName}
            labelClassName={labelClassName}
            {...register("purchase_request_code")}
          />
        </div>

        <div className="w-full sm:w-64">
          <Controller
            name="entry_status"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Estado de la entrada"
                value={field.value ?? ""}
                options={ENTRY_STATUS_OPTIONS}
                onChange={(value) =>
                  field.onChange(
                    value ? (String(value) as EntryStatusEnum) : null,
                  )
                }
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
