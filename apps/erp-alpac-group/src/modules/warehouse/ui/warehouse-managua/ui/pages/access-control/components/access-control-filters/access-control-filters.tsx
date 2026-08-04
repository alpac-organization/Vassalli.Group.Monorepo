import { Button, DatePicker, InputText } from "@alpac/design-system";
import type { DatePickerValue } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { AccessControlFiltersProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/types/access-control.types";
import {
  inputClassName,
  labelClassName,
  datePickerClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/utils/styles";

const EMPTY_FILTERS: AccessControlFilters = {
  ducat_number: "",
  plate_number: "",
  driver_name: "",
  start_date: null,
  end_date: null,
};

const DATE_RANGE_ERROR =
  "La fecha inicio no puede ser mayor a la fecha fin";

function toDayjs(value: DatePickerValue | null) {
  if (!value) return null;
  return dayjs((value as { $d?: Date }).$d ?? value).startOf("day");
}

function isStartAfterEnd(
  start: DatePickerValue | null,
  end: DatePickerValue | null,
) {
  const startDay = toDayjs(start);
  const endDay = toDayjs(end);
  if (!startDay || !endDay) return false;
  return startDay.isAfter(endDay);
}

export function AccessControlFiltersBar({
  onApply,
  onClear,
  defaultValues = EMPTY_FILTERS,
}: AccessControlFiltersProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<AccessControlFilters>({
    defaultValues,
    mode: "onSubmit",
  });

  const handleClear = () => {
    reset(EMPTY_FILTERS);
    onClear();
  };

  const applyFiltersIfValid = async (
    overrides?: Partial<
      Pick<AccessControlFilters, "start_date" | "end_date">
    >,
  ) => {
    if (overrides && "start_date" in overrides) {
      setValue("start_date", overrides.start_date ?? null, {
        shouldValidate: false,
      });
    }
    if (overrides && "end_date" in overrides) {
      setValue("end_date", overrides.end_date ?? null, {
        shouldValidate: false,
      });
    }

    const isValid = await trigger("start_date");
    if (!isValid) return;

    const current = getValues();
    onApply({
      ducat_number: current.ducat_number.trim(),
      plate_number: current.plate_number.trim(),
      driver_name: current.driver_name.trim(),
      start_date: current.start_date,
      end_date: current.end_date,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por Num.Ducat, placa, conductor o rango de fechas para la
            búsqueda de unidades en el plantel. Puede enviar solo fecha inicio.
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(async (values) => {
          const isValid = await trigger("start_date");
          if (!isValid) return;
          if (isStartAfterEnd(values.start_date, values.end_date)) return;
          onApply(values);
        })}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 items-end"
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
          <Controller
            name="start_date"
            control={control}
            rules={{
              validate: (value) => {
                if (!isStartAfterEnd(value, getValues("end_date"))) return true;
                return DATE_RANGE_ERROR;
              },
            }}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha inicio"
                className={datePickerClassName}
                labelClassName={labelClassName}
                labelAbove
                value={field.value}
                onOpen={() => clearErrors("start_date")}
                onChange={(value) => {
                  field.onChange(value);
                  clearErrors("start_date");
                }}
                onAccept={(value) => {
                  field.onChange(value);
                  clearErrors("start_date");
                }}
                error={
                  typeof errors.start_date?.message === "string"
                    ? errors.start_date.message
                    : undefined
                }
                errorVariant="tooltip"
              />
            )}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="end_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                fieldWidth="large"
                label="Fecha fin"
                className={datePickerClassName}
                labelClassName={labelClassName}
                labelAbove
                value={field.value}
                onOpen={() => clearErrors("start_date")}
                onChange={(value) => {
                  field.onChange(value);
                  clearErrors("start_date");
                }}
                onAccept={(value) => {
                  field.onChange(value);
                  void applyFiltersIfValid({ end_date: value });
                }}
                errorVariant="tooltip"
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
