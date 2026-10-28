import { Button, Dropdown } from "@alpac/design-system";
import type {
  SanctionsFilterFormValues,
  SanctionsFiltersProps,
} from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters.types";
import {
  SANCTION_STATUS_FILTER_OPTIONS,
  SANCTION_TYPE_FILTER_OPTIONS,
  disciplinaryDropdownClassName,
  disciplinaryLabelClassName,
  disciplinaryPrimaryButtonClassName,
  disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

const DEFAULT_VALUES: SanctionsFilterFormValues = {
  sanction_type: "all",
  sanction_status: "all",
};

export const SanctionsFilters = ({
  onApply,
  onClear,
}: SanctionsFiltersProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<SanctionsFilterFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit: SubmitHandler<SanctionsFilterFormValues> = (values) => {
    onApply(values);
  };

  const handleClear = () => {
    reset(DEFAULT_VALUES);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-center dark:border-t-neutral-600">
        <h3 className="m-0! p-0!">Filtros</h3>
        <small className="text-gray-500 dark:text-gray-300">
          Filtra sanciones por tipo o estado
        </small>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Controller
          name="sanction_type"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Tipo de sanción"
              appearance="dark"
              placeholder="Todos los tipos"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={SANCTION_TYPE_FILTER_OPTIONS}
              labelClassName={disciplinaryLabelClassName}
              valueClassName={disciplinaryLabelClassName}
              className={disciplinaryDropdownClassName}
            />
          )}
        />

        <Controller
          name="sanction_status"
          control={control}
          render={({ field }) => (
            <Dropdown
              label="Estado"
              appearance="dark"
              placeholder="Todos los estados"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={SANCTION_STATUS_FILTER_OPTIONS}
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
