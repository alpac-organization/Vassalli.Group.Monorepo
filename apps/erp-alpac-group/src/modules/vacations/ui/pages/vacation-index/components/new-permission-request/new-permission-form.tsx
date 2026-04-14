import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, DatePicker, Dropdown, InputText, Textarea } from "@alpac/design-system";
import dayjs from "@app/shared/dayjs";
import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { NewPermissionRequestFormProps } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/new-permissionFormProps";
import { validateSessionContextUtils } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/utils/validateSessionContext";
import { validateDatesUtils } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/utils/validateDates";
// import { validateTimesUtils } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/utils/validateTimes";
import { PERMISSION_TYPE_OPTIONS } from "@app/modules/vacations/ui/pages/vacation-index/constants/permission-filters.constants";
import { countInclusiveCalendarDays } from "@app/modules/vacations/ui/pages/vacation-index/utils/count-inclusive-calendar-days";
import type { PermissionRequestFormValues } from "./types/permission-form.types";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import { PERMISSION_TYPE_TO_ENUM_VALUE } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/new-permissionFormProps";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

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
      control,
   } = useForm<PermissionRequestFormValues>({
      defaultValues: {
         //type: "Vacation",
         start_date: "",
         end_date: "",
         start_time: "",
         end_time: "",
         description: "",
      },
   });

   // const selectedType = watch("type");
   const startDate = watch("start_date");
   const endDate = watch("end_date");
   // const isVacation = selectedType === "Vacation";
   const isSameDay = Boolean(startDate && endDate && startDate === endDate);
   // const showTimeInputs = !isVacation && isSameDay;

   const [isEnableDonatedVacationForm, setIsEnableDonatedVacationForm] = useState(false);

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

      const valuetesting = value as PermissionType;

      console.log("Testing : ", value, valuetesting, valuetesting === "DonatedVacations");


      setIsEnableDonatedVacationForm(valuetesting === "DonatedVacations");

      setValue("type", value as PermissionType);
      if (value === "Vacation") {
         setValue("start_time", "");
         setValue("end_time", "");
         clearErrors(["start_time", "end_time"]);
      }
   };

   const handleFormSubmit = (values: PermissionRequestFormValues) => {
      if (
         !validateSessionContextUtils(
            companyId,
            moduleCode,
            identificationNumber,
            setError,
         )
      ) {
         return;
      }

      if (!validateDatesUtils(requestedDays, setError)) {
         return;
      }

      // if (!validateTimesUtils(showTimeInputs, setError, values)) {
      //    return;
      // }

      const toIsoUtcZ = (ymd: string) =>
         new Date(ymd).toISOString().split(".")[0] + "Z";

      const payload: CreatePermissionRequest = {
         company_id: companyId,
         module_code: moduleCode,
         identification_number: identificationNumber.trim(),
         permit_application_type: PERMISSION_TYPE_TO_ENUM_VALUE[values.type],
         start_date: toIsoUtcZ(values.start_date),
         end_date: toIsoUtcZ(values.end_date),
         // start_time: showTimeInputs ? values.start_time : null,
         // end_time: showTimeInputs ? values.end_time : null,
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

         <Controller
            name="type"
            control={control}
            rules={{
               required: false,
            }}
            render={({ field }) => (
               <Dropdown
                  placeholder="Tipo de permiso"
                  value={field.value}
                  onChange={(value) => {
                     field.onChange(value);
                     handleTypeChange(value);
                  }}
                  labelClassName={labelClassName}
                  valueClassName={labelClassName}
                  className={inputClassName}
                  options={PERMISSION_TYPE_OPTIONS ?? []}
               />
            )}
         />

         <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 flex flex-col gap-1.5">
               <Controller
                  name="start_date"
                  control={control}
                  rules={{
                     required: "La fecha de inicio es requerida.",
                  }}
                  render={({ field }) => {
                     const parsed = field.value ? dayjs(field.value) : null;
                     const pickerValue = parsed?.isValid() ? parsed : null;
                     return (
                        <DatePicker
                           fieldWidth="large"
                           label="Fecha de inicio"
                           value={pickerValue}
                           onChange={(v) =>
                              field.onChange(v && v.isValid() ? v.format("YYYY-MM-DD") : "")
                           }
                           slotProps={{
                              textField: {
                                 inputRef: field.ref,
                                 onBlur: field.onBlur,
                                 error: Boolean(errors.start_date),
                                 helperText: errors.start_date?.message,
                              },
                           }}
                        />
                     );
                  }}
               />
            </div>
            <div className="min-w-0 flex flex-col gap-1.5">
               <Controller
                  name="end_date"
                  control={control}
                  rules={{
                     required: "La fecha de fin es requerida.",
                  }}
                  render={({ field }) => {
                     const parsed = field.value ? dayjs(field.value) : null;
                     const pickerValue = parsed?.isValid() ? parsed : null;
                     return (
                        <DatePicker
                           fieldWidth="large"
                           label="Fecha de fin"
                           value={pickerValue}
                           onChange={(v) =>
                              field.onChange(v && v.isValid() ? v.format("YYYY-MM-DD") : "")
                           }
                           slotProps={{
                              textField: {
                                 inputRef: field.ref,
                                 onBlur: field.onBlur,
                                 error: Boolean(errors.end_date),
                                 helperText: errors.end_date?.message,
                              },
                           }}
                        />
                     );
                  }}
               />
            </div>
         </div>

         {/* Sección solo para el formulario donacion de vacaciones  */}

         {
            isEnableDonatedVacationForm &&
            (
               <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0 flex flex-col gap-1.5">
                     <InputText
                        label="Dias a donar"
                        labelClassName={labelClassName}
                        type="number"
                        className={inputClassName}
                        error={errors.donated_vacation_days?.message}
                        {...register("donated_vacation_days", {
                           required: "Los dias a donar son requeridos.",
                           min: {
                              value: 1,
                              message: "Los dias a donar deben ser mayor a 0.",
                           }
                        })}
                     />
                  </div>
               </div>
            )
         }

         {
            //showTimeInputs 
            true && !isEnableDonatedVacationForm &&
            (
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
               className={`text-2xl font-bold ${requestedDays > 0
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
