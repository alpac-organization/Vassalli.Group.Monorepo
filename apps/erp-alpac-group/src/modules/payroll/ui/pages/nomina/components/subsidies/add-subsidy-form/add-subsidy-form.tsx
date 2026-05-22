import dayjs from "dayjs";
import { Button, DatePicker, Dropdown, InputText, Textarea } from "@alpac/design-system";
import { useSubsidy } from "@app/modules/payroll/ui/hooks/subsidy/useSubsidy";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useState } from "react";

import type { CreateSubsidyRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/create-subsidy.request";
import type { AddSubsidyFormProps, SubsidyTypeOption } from "./add-subsidy-form.types";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetSubsidyTypesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-types.response";

const inputClassName = "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const AddSubsidyForm = ({ payrollId, collaborator, onRequestSuccess, onRequestError, onCancel }: AddSubsidyFormProps) => {

   const FIRST_BIWEEKLY = 15;

   const { companyId, moduleCode } = useUserStore();

   const { CreateSubsidy, GetSubsidyTypes } = useSubsidy({
      subsidyTypesPayload: { company_id: companyId! }
   });

   const { getMappedError } = useMappedError();

   const [subsidyType, setSubsidyType] = useState<string | null>(null);

   const { data: subsidyTypesData } = GetSubsidyTypes;

   const subsidyTypesOptions: SubsidyTypeOption[] =
      subsidyTypesData && Array.isArray(subsidyTypesData)
         ? subsidyTypesData.map((item: GetSubsidyTypesResponse) => ({
            id: item.type_subsidy_id,
            value: item.type_subsidy_code,
            label: item.subsidy_name,
         }))
         : [];

   const {
      control, handleSubmit, reset, watch, setValue, formState: { errors, isValid }
   } = useForm<CreateSubsidyRequest>({
      mode: "onChange",
      defaultValues: {
         type_subsidy_id: "",
         start_date: null,
         end_date: null,
         reference_number: "",
         observations: ""
      }
   });

   const startDate = watch("start_date");

   const onSubmit = (data: CreateSubsidyRequest) => {

      const type = subsidyTypesOptions.find(type => type.value === data.type_subsidy_id)

      const payload: CreateSubsidyRequest = {
         ...data,
         company_id: companyId,
         module_code: moduleCode,
         payroll_id: payrollId,
         type_subsidy_id: type?.id!,
         collaborator_id: collaborator.collaborator_id.toString(),
         start_date: dayjs(data.start_date) ? dayjs(data.start_date).toISOString() : null,
         end_date: dayjs(data.end_date) ? dayjs(data.end_date).toISOString() : null,
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

  /*  const minAllowedDate = useMemo(
      // () => (subsidyType ? dayjs('2026-06-04') : null),
      () => (subsidyType ? dayjs().startOf("day") : null),
      [subsidyType],
   );

   const maxEndDateFromStart = useMemo(() => {

      if (!startDate) return null;

      const start = dayjs(startDate).startOf("day");

      if (!start.isValid()) return null;

      const firstBiweekly = dayjs(startDate).date(FIRST_BIWEEKLY).endOf('day');
      const secondBiweekly = dayjs(startDate).endOf('month').endOf('day');

      const isDayBetweenFirstBiweekly = start.date() <= firstBiweekly.date();
      const isDayBetweenSecondBiweekly = start.date() > firstBiweekly.date() && start.date() <= secondBiweekly.date();

      if (isDayBetweenFirstBiweekly) return firstBiweekly;
      if (isDayBetweenSecondBiweekly) return secondBiweekly;

      return null;

   }, [startDate]);

   const endDateMin = useMemo(() => {
      if (!startDate) return minAllowedDate;
      const start = dayjs(startDate).startOf("day");
      return start.isValid() ? start : minAllowedDate;
   }, [startDate, minAllowedDate]);

   const endDateMax = useMemo(() => {
      return maxEndDateFromStart;
   }, [maxEndDateFromStart]);
 */
   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="flex min-w-0 flex-col gap-4 sm:gap-5" noValidate>

         {/* ── Sección: Tipo de Subsidio ── */}
         <div className="flex flex-col gap-1.5">

            <Controller
               control={control}
               name="type_subsidy_id"
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
                     options={subsidyTypesOptions}
                     value={field.value ?? ""}
                     onChange={(value) => {
                        field.onChange(value);
                        setSubsidyType(value as string);
                        setValue('start_date', null);
                        setValue('end_date', null);
                     }}
                     error={errors.type_subsidy_id?.message as string}
                  />

               )}
            />

         </div>

         {/* ── Sección: Fechas ── */}
         {
            subsidyType && (
               <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0 flex flex-col gap-1.5">
                     <Controller
                        name="start_date"
                        control={control}
                        rules={{
                           required: "La fecha de inicio es requerida.",
                        }}
                        render={({ field }) => (
                           <DatePicker
                              fieldWidth="large"
                              label="Fecha de inicio"
                              className="w-full"
                              labelAbove
                              isRequired
                              //minDate={minAllowedDate}
                              //maxDate={minAllowedDate}
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(value) => {
                                 field.onChange(value);
                              }}
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

                              const start = dayjs(startDate).startOf("day");
                              const end = dayjs(value).startOf("day");

                              if (!end.isValid()) return "La fecha no es válida.";

                              if (end.isBefore(start, "day")) {
                                 return "La fecha de fin no puede ser anterior a la de inicio.";
                              }

                              const maxEnd = start.add(30, "day");

                              if (end.isAfter(maxEnd, "day")) {
                                 return "La fecha de fin no puede ser más de 30 días después del inicio.";
                              }

                              return true;
                           }
                        }}
                        render={({ field }) => (
                           <DatePicker
                              fieldWidth="large"
                              label="Fecha de fin (Provisional)"
                              className="w-full"
                              value={field.value ? dayjs(field.value) : null}
                              labelAbove
                              isRequired
                              //minDate={endDateMin}
                              //maxDate={endDateMax}
                              onChange={(value) => field.onChange(value)}
                              error={errors.end_date?.message as string}
                           />
                        )}
                     />

                  </div>
               </div>
            )
         }

         {/* ── Sección: Datos Médicos ── */}
         {
            subsidyType && (
               <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0 flex flex-col gap-1.5">
                     <Controller
                        name="reference_number"
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
                              error={errors.reference_number?.message as string}
                           />
                        )}
                     />
                  </div>
               </div>
            )
         }

         {/* ── Sección: Observaciones ── */}
         {
            subsidyType && (
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
            )
         }

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
               disabled={CreateSubsidy.isPending || !subsidyType || !isValid}
               isLoading={CreateSubsidy.isPending}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </form>
   )
}