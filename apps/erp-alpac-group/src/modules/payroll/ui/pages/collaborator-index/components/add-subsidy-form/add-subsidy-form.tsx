import { Button, DatePicker, Dropdown, InputText, Textarea } from "@alpac/design-system";
import dayjs from "dayjs";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import { useSubsidy } from "@app/modules/payroll/ui/hooks/subsidy/useSubsidy";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Controller, useForm } from "react-hook-form";
import type { AddSubsidyFormProps } from "./add-subsidy-form.types";

const inputClassName = "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const SUBSIDY_TYPE_OPTIONS = [
   { value: "common_illness", label: "Enfermedad Común" },
   { value: "work_accident", label: "Riesgo Laboral" },
   { value: "maternity", label: "Maternidad" },
];

export const AddSubsidyForm = ({ collaborator, onRequestSuccess, onRequestError, onCancel }: AddSubsidyFormProps) => {

   const { companyId, moduleCode } = useUserStore();
   const { CreateSubsidy } = useSubsidy();
   const { getMappedError } = useMappedError();

   const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateSubsidyRequest>({
      mode: "onChange",
      defaultValues: {
         subsidy_type: "",
         start_date: null,
         end_date: null,
         boleta_number: "",
         observations: ""
      }
   });

   const startDate = watch("start_date");

   // Límites de fechas: 1 de enero del año anterior hasta 6 meses al futuro
   const minAllowedDate = dayjs().subtract(1, 'year').startOf('year');
   const maxAllowedDate = dayjs().add(6, 'months');

   const onSubmit = (data: CreateSubsidyRequest) => {
      const payload: CreateSubsidyRequest = {
         ...data,
         company_id: companyId,
         module_code: moduleCode,
         collaborator_id: collaborator.collaborator_id.toString()
      };

      CreateSubsidy.mutate(payload, {
         onSuccess: () => {
            reset();
            onRequestSuccess?.("Subsidio registrado exitosamente");
         },
         onError: (error) => {
            const mappedError = getMappedError(error as ApiErrorResponse);
            onRequestError?.(mappedError?.description || "Error al registrar el subsidio");
         }
      });
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="flex min-w-0 flex-col gap-4 sm:gap-5" noValidate>

         {/* ── Sección: Tipo de Subsidio ── */}
         <div className="flex flex-col gap-1.5">

            <Controller
               control={control}
               name="subsidy_type"
               rules={{
                  required: "El tipo de subsidio es requerido.",
               }}
               render={({ field }) => (

                  <Dropdown
                     label="Tipo de subsidio"
                     placeholder="Seleccione el tipo de subsidio"
                     appearance="dark"
                     isRequired
                     labelClassName={labelClassName}
                     valueClassName={labelClassName}
                     className={inputClassName}
                     options={SUBSIDY_TYPE_OPTIONS}
                     value={field.value ?? ""}
                     onChange={(value) => field.onChange(value)}
                     error={errors.subsidy_type?.message as string}
                  />

               )}
            />

         </div>

         {/* ── Sección: Fechas ── */}
         <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 flex flex-col gap-1.5">
               <Controller
                  name="start_date"
                  control={control}
                  rules={{
                     required: "La fecha de inicio es requerida.",
                     validate: (value) => {
                        const date = dayjs(value);
                        if (date.isBefore(minAllowedDate, 'day')) return "La fecha no puede ser anterior al año pasado.";
                        if (date.isAfter(maxAllowedDate, 'day')) return "La fecha no puede exceder los 6 meses a futuro.";
                        return true;
                     }
                  }}
                  render={({ field }) => (
                     <DatePicker
                        fieldWidth="large"
                        label="Fecha de inicio"
                        className="w-full"
                        labelAbove
                        isRequired
                        minDate={minAllowedDate}
                        maxDate={maxAllowedDate}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        error={errors.start_date?.message as string}
                     />
                  )}
               />
            </div>

            <div className="min-w-0 flex flex-col gap-1.5">

               <Controller
                  name="end_date"
                  control={control}
                  rules={{
                     required: "La fecha de fin es requerida.",
                     validate: (value) => {
                        if (!startDate) return true;
                        const start = dayjs(startDate);
                        const end = dayjs(value);
                        if (end.isBefore(start, 'day')) return "La fecha de fin no puede ser anterior a la de inicio.";
                        if (end.isAfter(maxAllowedDate, 'day')) return "La fecha no puede exceder los 6 meses a futuro.";
                        return true;
                     }
                  }}
                  render={({ field }) => (
                     <DatePicker
                        fieldWidth="large"
                        label="Fecha de fin (Provisional)"
                        className="w-full"
                        value={field.value}
                        labelAbove
                        isRequired
                        minDate={startDate ? dayjs(startDate) : minAllowedDate}
                        maxDate={maxAllowedDate}
                        onChange={(value) => field.onChange(value)}
                        error={errors.end_date?.message as string}
                     />
                  )}
               />

            </div>
         </div>

         {/* ── Sección: Datos Médicos ── */}
         <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 flex flex-col gap-1.5">
               <Controller
                  name="boleta_number"
                  control={control}
                  rules={{ required: "El número de boleta es requerido." }}
                  render={({ field }) => (
                     <InputText
                        label="Nº de Boleta"
                        placeholder="Ingrese el número de boleta"
                        labelClassName={labelClassName}
                        isRequired
                        className={inputClassName}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        error={errors.boleta_number?.message as string}
                     />
                  )}
               />
            </div>
         </div>

         {/* ── Sección: Observaciones ── */}
         <div className="flex flex-col gap-1.5">
            <Controller
               name="observations"
               control={control}
               rules={{
                  maxLength: {
                     value: 500,
                     message: "La observación debe tener como máximo 500 caracteres"
                  }
               }}
               render={({ field }) => (
                  <Textarea
                     label="Observaciones (Opcional)"
                     labelClassName={labelClassName}
                     rows={3}
                     maxLength={500}
                     placeholder="Detalles adicionales del subsidio..."
                     className={`${inputClassName} resize-none`}
                     value={field.value ?? ""}
                     onChange={field.onChange}
                     error={errors.observations?.message as string}
                  />
               )}
            />
         </div>

         {/* ── Sección: Resumen calculado (solo lectura) ── */}
         {/* <div className="rounded-md border border-slate-300 dark:border-neutral-600 bg-slate-50 dark:bg-[#1e2229] p-4 flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
               Resumen del subsidio
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px]">
               <span className="text-slate-500 dark:text-slate-400">Total de días:</span>
               <span className="text-slate-800 dark:text-white font-medium">—</span>

               <span className="text-slate-500 dark:text-slate-400">Días a cargo del empleador (1–3):</span>
               <span className="text-slate-800 dark:text-white font-medium">— días</span>

               <span className="text-slate-500 dark:text-slate-400">Días a cargo del INSS (día 4+):</span>
               <span className="text-slate-800 dark:text-white font-medium">— días (60%)</span>

               <span className="text-slate-500 dark:text-slate-400">Monto empleador:</span>
               <span className="text-slate-800 dark:text-white font-medium">C$ —</span>

               <span className="text-slate-500 dark:text-slate-400">Monto INSS:</span>
               <span className="text-slate-800 dark:text-white font-medium">C$ —</span>
            </div>
         </div> */}

         {/* ── Acciones ── */}
         <div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6"></div>
         <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
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
               label="Registrar Subsidio"
               disabled={CreateSubsidy.isPending}
               isLoading={CreateSubsidy.isPending}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </form>
   )
}