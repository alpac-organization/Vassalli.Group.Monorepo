import {
  Button,
  DatePicker,
  type DatePickerValue,
  Dropdown,
} from "@alpac/design-system";
import type {
  InternalPersonnelActionsFilterForm,
  PersonnelActionsFiltersProps,
} from "./personnel-actions-filters.types";
import {
  ACTION_SCOPE_FILTER_OPTIONS,
  ACTION_STATUS_FILTER_OPTIONS,
  actionDropdownClassName,
  actionLabelClassName,
  actionPrimaryButtonClassName,
  actionSecondaryButtonClassName,
} from "../../utils/personnel-actions.constants";
import { toApiDate } from "@app/shared/utils/date.utils";
import dayjs from "dayjs";
import { Controller, useForm, useWatch, type SubmitHandler } from "react-hook-form";

const DEFAULT_VALUES: InternalPersonnelActionsFilterForm = {
  status: "all",
  scope: "all",
  start_date: null,
  end_date: null,
};

export const PersonnelActionsFilters = ({
  onApply,
  onClear,
  isLoading = false,
}: PersonnelActionsFiltersProps) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<InternalPersonnelActionsFilterForm>({
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const startDateValue = useWatch({ control, name: "start_date" });
  const endDateValue = useWatch({ control, name: "end_date" });

  const onSubmit: SubmitHandler<InternalPersonnelActionsFilterForm> = (values) => {
    onApply({
      status: values.status || "all",
      scope: values.scope || "all",
      start_date: toApiDate(values.start_date),
      end_date: toApiDate(values.end_date),
    });
  };

  const handleClear = () => {
    reset(DEFAULT_VALUES);
    onClear();
  };

  return (
    <div className="flex flex-col gap-4 pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
      <div className="flex flex-col justify-center">
        <h3 className="m-0! p-0!">Filtros</h3>
        <small className="text-gray-500 dark:text-gray-300">
          Filtra por estado, alcance o rango de fecha efectiva
        </small>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                options={ACTION_STATUS_FILTER_OPTIONS}
                labelClassName={actionLabelClassName}
                valueClassName={actionLabelClassName}
                className={actionDropdownClassName}
              />
            )}
          />

          <Controller
            name="scope"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Alcance"
                appearance="dark"
                placeholder="Todos los alcances"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                options={ACTION_SCOPE_FILTER_OPTIONS}
                labelClassName={actionLabelClassName}
                valueClassName={actionLabelClassName}
                className={actionDropdownClassName}
              />
            )}
          />

          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha efectiva desde"
                labelAbove
                className={actionDropdownClassName}
                labelClassName={actionLabelClassName}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                maxDate={
                  endDateValue
                    ? dayjs((endDateValue as DatePickerValue)?.$d ?? endDateValue)
                    : undefined
                }
              />
            )}
          />

          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha efectiva hasta"
                labelAbove
                className={actionDropdownClassName}
                labelClassName={actionLabelClassName}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                minDate={
                  startDateValue
                    ? dayjs((startDateValue as DatePickerValue)?.$d ?? startDateValue)
                    : undefined
                }
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <Button
            type="submit"
            size="giant"
            label="Aplicar filtros"
            className={actionPrimaryButtonClassName}
            disabled={!isDirty || isLoading}
          />
          <Button
            type="button"
            size="giant"
            label="Limpiar filtros"
            className={actionSecondaryButtonClassName}
            onClick={handleClear}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};
