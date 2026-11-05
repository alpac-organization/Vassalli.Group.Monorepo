import {
  Button,
  DatePicker,
  type DatePickerValue,
  Dropdown,
  InputText,
} from "@alpac/design-system";
import type {
  AbsencesFiltersProps,
} from "@app/modules/payroll/ui/pages/disciplinary-management/components/absences-filters/absences-filters.types";
import {
  ABSENCE_SOURCE_FILTER_OPTIONS,
  ABSENCE_STATUS_FILTER_OPTIONS,
  disciplinaryDropdownClassName,
  disciplinaryInputClassName,
  disciplinaryLabelClassName,
  disciplinaryPrimaryButtonClassName,
  disciplinarySecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import dayjs from "dayjs";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

type InternalFilterFormValues = {
  identification_number: string;
  status: string;
  source: string;
  start_date: DatePickerValue | null;
  end_date: DatePickerValue | null;
};

const DEFAULT_VALUES: InternalFilterFormValues = {
  identification_number: "",
  status: "all",
  source: "all",
  start_date: null,
  end_date: null,
};

const toApiDate = (date: DatePickerValue | null | undefined): string | null => {
  if (!date) return null;
  const d = dayjs((date as DatePickerValue)?.$d ?? date);
  return d.isValid() ? d.format("YYYY-MM-DD") : null;
};

export const AbsencesFilters = ({
  onApply,
  onClear,
  canWrite = false,
  onRegisterAbsence,
}: AbsencesFiltersProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<InternalFilterFormValues>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const startDateValue = watch("start_date");
  const endDateValue = watch("end_date");

  const onSubmit: SubmitHandler<InternalFilterFormValues> = (values) => {
    onApply({
      identification_number: values.identification_number.trim(),
      status: values.status,
      source: values.source,
      start_date: toApiDate(values.start_date) ?? "",
      end_date: toApiDate(values.end_date) ?? "",
    });
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
            Filtra ausencias por identificación, estado, origen o rango de fechas
          </small>
        </div>
        {canWrite && (
          <Button
            type="button"
            size="giant"
            label="Registrar ausencia"
            styles={{ width: "max-content" }}
            className={disciplinaryPrimaryButtonClassName}
            onClick={onRegisterAbsence}
          />
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <InputText
            label="Identificación"
            className={disciplinaryInputClassName}
            labelClassName={disciplinaryLabelClassName}
            placeholder="Buscar por cédula"
            {...register("identification_number")}
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
                options={ABSENCE_STATUS_FILTER_OPTIONS}
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
                options={ABSENCE_SOURCE_FILTER_OPTIONS}
                labelClassName={disciplinaryLabelClassName}
                valueClassName={disciplinaryLabelClassName}
                className={disciplinaryDropdownClassName}
              />
            )}
          />

          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha desde"
                labelAbove
                className={disciplinaryDropdownClassName}
                labelClassName={disciplinaryLabelClassName}
                value={field.value}
                maxDate={
                  endDateValue
                    ? dayjs((endDateValue as DatePickerValue)?.$d ?? endDateValue)
                    : undefined
                }
                onChange={(value) => field.onChange(value)}
              />
            )}
          />

          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha hasta"
                labelAbove
                className={disciplinaryDropdownClassName}
                labelClassName={disciplinaryLabelClassName}
                value={field.value}
                minDate={
                  startDateValue
                    ? dayjs((startDateValue as DatePickerValue)?.$d ?? startDateValue)
                    : undefined
                }
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
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
        </div>
      </form>
    </div>
  );
};
