import { Button, Dropdown, InputText } from "@alpac/design-system";
import type {
  FaultsFilterFormValues,
  FaultsFiltersProps,
} from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-filters/faults-filters.types";
import {
  FAULT_SEVERITY_FILTER_OPTIONS,
  FAULT_SOURCE_FILTER_OPTIONS,
  FAULT_STATUS_FILTER_OPTIONS,
  disciplinaryDropdownClassName,
  disciplinaryInputClassName,
  disciplinaryLabelClassName,
  disciplinaryPrimaryButtonClassName,
  disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

const DEFAULT_VALUES: FaultsFilterFormValues = {
  code: "",
  severity: "all",
  status: "all",
  source: "all",
};

export const FaultsFilters = ({
  onApply,
  onClear,
  canWrite = false,
  onRegisterFault,
}: FaultsFiltersProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<FaultsFilterFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit: SubmitHandler<FaultsFilterFormValues> = (values) => {
    onApply(values);
  };

  const handleClear = () => {
    reset(DEFAULT_VALUES);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-col justify-center">
          <h3 className="m-0! p-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Filtra faltas por código, severidad, estado u origen
          </small>
        </div>
        {canWrite && (
          <Button
            type="button"
            size="giant"
            label="Registrar falta"
            styles={{width: "max-content"}}
            className={disciplinaryPrimaryButtonClassName}
            onClick={onRegisterFault}
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        <InputText
          label="Código catálogo"
          className={disciplinaryInputClassName}
          labelClassName={disciplinaryLabelClassName}
          placeholder="Ej. FL-ALP-01"
          {...register("code")}
        />

        <Controller
          name="severity"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Severidad"
              appearance="dark"
              placeholder="Todas las severidades"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={FAULT_SEVERITY_FILTER_OPTIONS}
              labelClassName={disciplinaryLabelClassName}
              valueClassName={disciplinaryLabelClassName}
              className={disciplinaryDropdownClassName}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Estado"
              appearance="dark"
              placeholder="Todos los estados"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={FAULT_STATUS_FILTER_OPTIONS}
              labelClassName={disciplinaryLabelClassName}
              valueClassName={disciplinaryLabelClassName}
              className={disciplinaryDropdownClassName}
            />
          )}
        />

        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Origen"
              appearance="dark"
              placeholder="Todos los orígenes"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={FAULT_SOURCE_FILTER_OPTIONS}
              labelClassName={disciplinaryLabelClassName}
              valueClassName={disciplinaryLabelClassName}
              className={disciplinaryDropdownClassName}
            />
          )}
        />

        <Button
          type="submit"
          size="giant"
          disabled={!isDirty}
          className={disciplinaryPrimaryButtonClassName}
          label="Aplicar filtros"
        />

        <Button
          type="button"
          size="giant"
          className={disciplinarySecondaryButtonClassName}
          label="Limpiar filtros"
          onClick={handleClear}
        />
      </form>
    </div>
  );
};
