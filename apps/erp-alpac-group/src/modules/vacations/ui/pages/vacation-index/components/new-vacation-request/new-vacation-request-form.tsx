import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, InputText } from "@alpac/design-system";
import { countInclusiveCalendarDays } from "@app/modules/vacations/ui/pages/vacation-index/utils/count-inclusive-calendar-days";
import type { VacationRequestFormValues } from "./vacation-request-form.types";
import type { CreateVacationRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-vacation-request";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

type NewVacationRequestFormProps = {
  isPending: boolean;
  onSubmit: (payload: CreateVacationRequest) => void;
  onCancel: () => void;
  companyId: string;
  moduleCode: string;
  identificationNumber: string;
};

export function NewVacationRequestForm({
  isPending,
  onSubmit,
  onCancel,
  companyId,
  moduleCode,
  identificationNumber,
}: NewVacationRequestFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<VacationRequestFormValues>({
    defaultValues: {
      start_date: "",
      end_date: "",
      description: "",
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const requestedDays = useMemo(
    () => countInclusiveCalendarDays(startDate, endDate),
    [startDate, endDate],
  );

  const handleFormSubmit = (values: VacationRequestFormValues) => {
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
    const payload: CreateVacationRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber.trim(),
      start_date: values.start_date,
      end_date: values.end_date,
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

      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-medium text-slate-600 dark:text-slate-300 ml-0.5">
          Días solicitados
        </span>
        <span
          className={`text-2xl font-bold ${
            requestedDays > 0
              ? "text-alpac-primary-500 dark:text-alpac-primary-400"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {requestedDays}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[14px] font-medium text-slate-600 dark:text-slate-300 ml-0.5">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Propósito o detalles de la solicitud..."
          className={`
            w-full box-border bg-white dark:bg-[#272b34] border rounded-[10px] outline-none transition-all
            py-2.5 px-4 text-[14px] md:text-[15px]
            placeholder:text-slate-500
            focus:border-blue-600 focus:ring-2 focus:ring-green-50/50
            resize-none
            ${errors.description ? "border-red-400 ring-red-50" : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-neutral-600"}
          `}
          {...register("description", {
            required: "La descripción es requerida.",
          })}
        />
        {errors.description && (
          <span className="text-[12px] text-red-500 ml-0.5">
            {errors.description.message}
          </span>
        )}
      </div>

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
