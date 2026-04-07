import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Dropdown, InputText, Textarea } from "@alpac/design-system";
import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import { PermissionTypeEnum } from "@app/modules/vacations/domain/enum/permissionType.enum";
import { PERMISSION_TYPE_OPTIONS } from "@app/modules/vacations/ui/pages/vacation-index/constants/permission-filters.constants";
import { countInclusiveCalendarDays } from "@app/modules/vacations/ui/pages/vacation-index/utils/count-inclusive-calendar-days";
import type { PermissionRequestFormValues } from "./types/permission-request-form.types";

const PERMISSION_TYPE_TO_ENUM_VALUE: Record<PermissionType, number> = {
  Vacation: PermissionTypeEnum.VACATION.value,
  MedicalAppointment: PermissionTypeEnum.MEDICAL_APPOINTMENT.value,
  CompensatoryTime: PermissionTypeEnum.COMPENSATORY_TIME.value,
  PaidLeave: PermissionTypeEnum.PAID_LEAVE.value,
  UnpaidLeave: PermissionTypeEnum.UNPAID_LEAVE.value,
  SpecialLeave: PermissionTypeEnum.SPECIAL_LEAVE.value,
};

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

type NewPermissionRequestFormProps = {
  isPending: boolean;
  onSubmit: (payload: CreatePermissionRequest) => void;
  onCancel: () => void;
  companyId: string;
  moduleCode: string;
  identificationNumber: string;
};

export function NewPermissionRequestForm({
  isPending,
  onSubmit,
  onCancel,
  companyId,
  moduleCode,
  identificationNumber,
}: NewPermissionRequestFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<PermissionRequestFormValues>({
    defaultValues: {
      type: "Vacation",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      description: "",
    },
  });

  const selectedType = watch("type");
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const isVacation = selectedType === "Vacation";
  const isSameDay = Boolean(startDate && endDate && startDate === endDate);
  const showTimeInputs = !isVacation && isSameDay;

  const requestedDays = useMemo(
    () => countInclusiveCalendarDays(startDate, endDate),
    [startDate, endDate],
  );

  useEffect(() => {
    if (!isSameDay) {
      setValue("start_time", "");
      setValue("end_time", "");
      clearErrors(["start_time", "end_time"]);
    }
  }, [isSameDay, setValue, clearErrors]);

  const handleTypeChange = (value: string) => {
    setValue("type", value as PermissionType);
    if (value === "Vacation") {
      setValue("start_time", "");
      setValue("end_time", "");
      clearErrors(["start_time", "end_time"]);
    }
  };

  const handleFormSubmit = (values: PermissionRequestFormValues) => {
    if (
      !companyId.trim() ||
      !moduleCode.trim() ||
      !identificationNumber.trim()
    ) {
      setError("root", {
        type: "manual",
        message:
          "Falta el contexto de sesión (empresa, módulo o identificación). Vuelve a iniciar sesión o selecciona un módulo.",
      });
      return;
    }
    if (requestedDays === 0) {
      setError("end_date", {
        type: "manual",
        message: "La fecha de fin debe ser igual o posterior a la de inicio.",
      });
      return;
    }
    if (showTimeInputs) {
      if (!values.start_time) {
        setError("start_time", {
          type: "manual",
          message: "La hora de inicio es requerida.",
        });
        return;
      }
      if (!values.end_time) {
        setError("end_time", {
          type: "manual",
          message: "La hora de fin es requerida.",
        });
        return;
      }
    }
    const payload: CreatePermissionRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber.trim(),
      permit_application_type: PERMISSION_TYPE_TO_ENUM_VALUE[values.type],
      start_date: values.start_date,
      end_date: values.end_date,
      start_time: showTimeInputs ? values.start_time : "",
      end_time: showTimeInputs ? values.end_time : "",
      description: values.description.trim(),
    };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-w-0 flex-col gap-4 sm:gap-5"
    >
      {errors.root?.message && (
        <p className="text-[13px] text-red-500" role="alert">
          {errors.root.message}
        </p>
      )}

      <Dropdown
        placeholder="Tipo de permiso"
        value={selectedType}
        onChange={handleTypeChange}
        options={PERMISSION_TYPE_OPTIONS}
        labelClassName={labelClassName}
        valueClassName={labelClassName}
        className={inputClassName}
      />

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0 flex flex-col gap-1.5">
          <InputText
            label="Fecha de inicio"
            labelClassName={labelClassName}
            type="date"
            className={inputClassName}
            error={errors.start_date?.message}
            {...register("start_date", {
              required: "La fecha de inicio es requerida.",
            })}
          />
        </div>
        <div className="min-w-0 flex flex-col gap-1.5">
          <InputText
            label="Fecha de fin"
            labelClassName={labelClassName}
            type="date"
            className={inputClassName}
            error={errors.end_date?.message}
            {...register("end_date", {
              required: "La fecha de fin es requerida.",
            })}
          />
        </div>
      </div>

      {showTimeInputs && (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0 flex flex-col gap-1.5">
            <InputText
              label="Hora de inicio"
              labelClassName={labelClassName}
              type="time"
              className={inputClassName}
              error={errors.start_time?.message}
              {...register("start_time")}
            />
          </div>
          <div className="min-w-0 flex flex-col gap-1.5">
            <InputText
              label="Hora de fin"
              labelClassName={labelClassName}
              type="time"
              className={inputClassName}
              error={errors.end_time?.message}
              {...register("end_time")}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-medium text-slate-600 dark:text-slate-300 ml-0.5">
          Días solicitados
        </span>
        <span
          className={`text-2xl font-bold ${
            requestedDays > 0
              ? "text-white dark:text-alpac-primary-400"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {requestedDays}
        </span>
      </div>

      <Textarea
        label="Descripción *"
        labelClassName={labelClassName}
        rows={3}
        placeholder="Propósito o detalles de la solicitud..."
        className={`${inputClassName} resize-none`}
        error={errors.description?.message}
        {...register("description", {
          required: "La descripción es requerida.",
        })}
      />

      <div className="flex min-w-0 flex-col-reverse gap-2.5 border-t border-slate-200 pt-2 sm:flex-row sm:justify-end sm:gap-3 dark:border-neutral-600">
        <Button
          type="button"
          size="giant"
          label="Cancelar"
          onClick={onCancel}
          className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
        />
        <Button
          type="submit"
          size="giant"
          label={isPending ? "Enviando..." : "Enviar solicitud"}
          disabled={isPending}
          className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
        />
      </div>
    </form>
  );
}
