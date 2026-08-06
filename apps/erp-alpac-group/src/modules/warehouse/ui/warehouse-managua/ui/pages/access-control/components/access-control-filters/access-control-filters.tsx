import { Button, DatePicker, Dropdown, InputText } from "@alpac/design-system";
import type { DatePickerValue, Option } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { DocumentEnum } from "@app/core/enums/document.enum";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import type { AccessControlFiltersProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/types/access-control.types";
import {
  inputClassName,
  labelClassName,
  datePickerClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/utils/styles";

const EMPTY_FILTERS: AccessControlFilters = {
  ducat_number: "",
  document_number: "",
  document_type: "",
  plate_number: "",
  driver_name: "",
  start_date: null,
  end_date: null,
};

const DOCUMENT_TYPE_OPTIONS: Option[] = [
  { value: "DUCA", label: DocumentEnum.DUCA.label },
  {
    value: "CustomsDeclaration",
    label: DocumentEnum.CustomsDeclaration.label,
  },
];

const DATE_RANGE_ERROR = "La fecha inicio no puede ser mayor a la fecha fin";

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

function buildFiltersPayload(
  values: AccessControlFilters,
): AccessControlFilters {
  return {
    ducat_number: (values.ducat_number ?? "").trim(),
    document_number: (values.document_number ?? "").trim(),
    document_type: (values.document_type ?? "").trim(),
    plate_number: (values.plate_number ?? "").trim(),
    driver_name: (values.driver_name ?? "").trim(),
    start_date: values.start_date,
    end_date: values.end_date,
  };
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
    overrides?: Partial<Pick<AccessControlFilters, "start_date" | "end_date">>,
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

    onApply(buildFiltersPayload(getValues()));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
            Filtra por número de DUCA, declaración aduanera, tipo, placa,
            conductor o rango de fechas. Puede enviar solo fecha inicio.
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(async (values) => {
          const isValid = await trigger("start_date");
          if (!isValid) return;
          if (isStartAfterEnd(values.start_date, values.end_date)) return;
          onApply(buildFiltersPayload(values));
        })}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 items-end"
      >
        <div className="flex flex-col min-w-0">
          <InputText
            label="Número de DUCA"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            errorVariant="tooltip"
            placeholder="Buscar N.º DUCA"
            {...register("ducat_number")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <InputText
            label="N.º Declaración aduanera"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            errorVariant="tooltip"
            placeholder="Buscar N.º declaración"
            {...register("document_number")}
          />
        </div>

        <div className="flex flex-col min-w-0">
          <Controller
            name="document_type"
            control={control}
            render={({ field }) => (
              <Dropdown
                appearance="dark"
                label="Tipo de documento"
                optional
                placeholder="Todos"
                options={DOCUMENT_TYPE_OPTIONS}
                value={field.value || undefined}
                onChange={(value) => field.onChange(String(value ?? ""))}
                labelClassName={labelClassName}
                className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
              />
            )}
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

        <div className="flex flex-row gap-3 min-w-0 w-full items-end self-end">
          <Button
            type="submit"
            size="giant"
            className="flex-1! sm:flex-none! w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
          />
          <Button
            type="button"
            size="giant"
            className="flex-1! sm:flex-none! w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClear}
          />
        </div>
      </form>
    </div>
  );
}
