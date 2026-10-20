import { memo } from "react";
import { Button, Dropdown, InputText } from "@alpac/design-system";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ConstitutionEnum } from "@app/core/enums/constitution.enum";
import {
  SupplierExclusiveStatusOptions,
  type SupplierExclusiveStatus,
} from "@app/core/enums/supplier-exclusive-status.enum";
import {
  formatIdentificationNumber,
  formatRuc,
} from "@app/shared/utils/string.utils";
import type { SupplierFilterValues } from "@app/modules/purchasing/ui/pages/supplier/supplier.types";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/purchasing/ui/pages/supplier/utils/style";

type SupplierFilterForm = {
  identification_number: string;
  constitution_type?: string;
  commercial_name: string;
  exclusive_status?: SupplierExclusiveStatus;
};

type SupplierFiltersProps = {
  onApply: (filters: SupplierFilterValues) => void;
  onClear: () => void;
};

const defaultFilterForm: SupplierFilterForm = {
  identification_number: "",
  constitution_type: undefined,
  commercial_name: "",
  exclusive_status: undefined,
};

const constitutionFilterOptions = Object.values(ConstitutionEnum)
  .map((item) => ({ value: item.stringValue, label: item.label }))
  .sort((a, b) => a.label.localeCompare(b.label));

const normalizeIdentification = (value: string) =>
  value.replace(/-/g, "").toUpperCase();

const formatIdentificationDisplay = (
  value: string,
  constitutionType?: string,
) => {
  if (!value) return "";

  if (constitutionType === ConstitutionEnum.Legal.stringValue) {
    return formatRuc(value);
  }

  if (constitutionType === ConstitutionEnum.Natural.stringValue) {
    return formatIdentificationNumber(value);
  }

  return value;
};

const toOptionalText = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const SupplierFilters = memo(function SupplierFilters({
  onApply,
  onClear,
}: SupplierFiltersProps) {
  const { register, handleSubmit, control, reset } =
    useForm<SupplierFilterForm>({
      defaultValues: defaultFilterForm,
    });

  const constitutionType = useWatch({
    control,
    name: "constitution_type",
  });

  const handleApply = (data: SupplierFilterForm) => {
    onApply({
      identification_number: toOptionalText(
        normalizeIdentification(
          formatIdentificationDisplay(
            data.identification_number,
            data.constitution_type,
          ),
        ),
      ),
      commercial_name: toOptionalText(data.commercial_name),
      constitution_type: toOptionalText(data.constitution_type),
      exclusive_status: data.exclusive_status || undefined,
    });
  };

  const handleClear = () => {
    reset(defaultFilterForm);
    onClear();
  };

  return (
    <>
      <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Filtre la lista de proveedores
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleApply)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
      >
        <Controller
          name="constitution_type"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Tipo de constitución"
              placeholder="Seleccione..."
              appearance="dark"
              options={constitutionFilterOptions}
              value={field.value ?? null}
              onChange={(value) => {
                const next =
                  value === null || value === undefined || value === ""
                    ? undefined
                    : String(value);
                field.onChange(next);
              }}
              className={dropdownClassName}
              labelClassName={labelClassName}
              valueClassName={labelClassName}
            />
          )}
        />

        <Controller
          name="exclusive_status"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Estado de exclusividad"
              placeholder="Seleccione..."
              appearance="dark"
              options={SupplierExclusiveStatusOptions}
              value={field.value ?? null}
              onChange={(value) => {
                const next =
                  value === null || value === undefined || value === ""
                    ? undefined
                    : (String(value) as SupplierExclusiveStatus);
                field.onChange(next);
              }}
              className={dropdownClassName}
              labelClassName={labelClassName}
              valueClassName={labelClassName}
            />
          )}
        />

        <InputText
          label="Nombre comercial"
          placeholder="Ej. DIMAC"
          className={inputClassName}
          labelClassName={labelClassName}
          {...register("commercial_name")}
        />

        <Controller
          name="identification_number"
          control={control}
          render={({ field }) => (
            <InputText
              label="Identificación"
              placeholder="Ej. J0310000000001"
              className={inputClassName}
              labelClassName={labelClassName}
              name={field.name}
              ref={field.ref}
              value={formatIdentificationDisplay(
                field.value ?? "",
                constitutionType,
              )}
              onBlur={field.onBlur}
              onChange={(event) => {
                const displayed = formatIdentificationDisplay(
                  event.target.value,
                  constitutionType,
                );
                field.onChange(normalizeIdentification(displayed));
              }}
            />
          )}
        />

        <Button
          type="submit"
          size="giant"
          label="Aplicar filtros"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        />

        <Button
          type="button"
          size="giant"
          label="Limpiar filtros"
          onClick={handleClear}
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
        />
      </form>
    </>
  );
});
