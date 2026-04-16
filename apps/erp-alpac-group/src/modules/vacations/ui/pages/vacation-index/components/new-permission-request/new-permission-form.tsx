import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, DatePicker, Dropdown, InputText, RadioButton, Textarea } from "@alpac/design-system";
import { validateSessionContextUtils } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/utils/validateSessionContext";
import { PERMISSION_TYPE_OPTIONS } from "@app/modules/vacations/ui/pages/vacation-index/constants/permission-filters.constants";
import { PERMISSION_TYPE_TO_ENUM_VALUE } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/new-permissionFormProps";
import { motion, type Variants } from "framer-motion";

import type { NewPermissionRequestFormProps } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/types/new-permissionFormProps";
import type { PermissionRequestFormValues } from "./types/permission-form.types";
import type { CreatePermissionRequest } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";
import type { PermissionType } from "@app/modules/vacations/domain/ApiContract/Requests/create-permission-request";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export function NewPermissionRequestForm(
   { isPending, onSubmit, onCancel, companyId, moduleCode, identificationNumber }: NewPermissionRequestFormProps) {

   const defaultValues = {
      type: undefined,
      start_date: null,
      end_date: null,
      start_time: "",
      end_time: "",
      description: "",
   };

   const formContainerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1, transition: {
            staggerChildren: 0.07,
            delayChildren: 0.04,
         }
      },
      exit: {
         opacity: 0,
         transition: {
            duration: 0.15,
            staggerChildren: 0.04,
            staggerDirection: -1
         },
      }
   }

   const formFieldVariants: Variants = {
      hidden: {
         opacity: 0,
         y: 14
      },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            duration: 0.25,
            ease: "easeOut"
         }
      },
      exit: {
         opacity: 0,
         y: 6,
         transition: {
            duration: 0.15
         }
      },
   };

   const {
      register, handleSubmit, setError, control, formState: { errors }
   } = useForm<PermissionRequestFormValues>({ defaultValues });

   const initialSelectedType: Record<PermissionType, boolean> = {
      Vacation: false,
      DonatedVacations: false,
      MedicalAppointment: false
   };

   const [applicationType, setApplicationType] = useState(initialSelectedType);
   const [startDate, setStartDate] = useState<Date | null>(null);
   const [endDate, setEndDate] = useState<Date | null>(null);
   const [timeFormat, setTimeFormat] = useState<"halfDay" | "fullDay" | "rangeOfHours">("fullDay");

   const isSelectedAtLeastOneType = useMemo(
      () => Object.values(applicationType).some((value) => value === true),
      [applicationType]
   );

   const isSameDay = useMemo(() => {
      if (!startDate || !endDate) return false;
      return startDate.toDateString() === endDate.toDateString()
   }, [startDate, endDate]);

   const handleTypeChange = (value: string) => {

      const type = value as PermissionType;

      // Solo un tipo puede estar activo a la vez — resetea los demás
      setApplicationType({ ...initialSelectedType, [type]: true });
   };

   const handleFormSubmit = (values: PermissionRequestFormValues) => {

      if (!validateSessionContextUtils(companyId, moduleCode, identificationNumber, setError)) {
         return;
      }

      const toIsoUtcZ = (ymd: string) =>
         new Date(ymd).toISOString().split(".")[0] + "Z";

      const payload: CreatePermissionRequest = {
         company_id: companyId,
         module_code: moduleCode,
         identification_number: identificationNumber.trim(),
         permit_application_type: PERMISSION_TYPE_TO_ENUM_VALUE[values.type],
         start_date: toIsoUtcZ(values.start_date.$d),
         end_date: toIsoUtcZ(values.end_date.$d),
         start_time: timeFormat === "rangeOfHours" ? values.start_time : null,
         end_time: timeFormat === "rangeOfHours" ? values.end_time : null,
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
            <p className="text-[13px] text-red-500 dark:text-red-400" role="alert">
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
                  appearance="dark"
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

         {isSelectedAtLeastOneType && (

            <motion.div
               variants={formContainerVariants}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="flex flex-col gap-4 sm:gap-5">

               {
                  (applicationType.Vacation || applicationType.MedicalAppointment) && (
                     <motion.div
                        variants={formFieldVariants}
                        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

                        {(applicationType.Vacation || applicationType.MedicalAppointment) && (
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
                                       label={`${applicationType.MedicalAppointment ? "Fecha de cita" : "Fecha inicio"}`}
                                       className="w-full"
                                       value={field.value}
                                       onChange={(value) => {
                                          setStartDate(value.$d)
                                          field.onChange(value)
                                       }}
                                    />
                                 )}
                              />
                           </div>
                        )}


                        {applicationType.Vacation && (
                           <div className="min-w-0 flex flex-col gap-1.5">
                              <Controller
                                 name="end_date"
                                 control={control}
                                 rules={{
                                    required: "La fecha de fin es requerida.",

                                 }}
                                 render={({ field }) => (
                                    <DatePicker
                                       fieldWidth="large"
                                       label="Fecha fin"
                                       className="w-full"
                                       value={field.value}
                                       onChange={(value) => {
                                          setEndDate(value.$d)
                                          field.onChange(value)
                                       }}
                                    />
                                 )}
                              />
                           </div>
                        )}

                     </motion.div>
                  )
               }

               {(applicationType.Vacation && isSameDay) && (
                  <motion.div
                     variants={formFieldVariants}
                     className="flex flex-row gap-4">

                     <RadioButton
                        id="full-day"
                        value="fullDay"
                        label="Día completo"
                        labelPosition="right"
                        labelClassName={labelClassName}
                        checked={timeFormat === "fullDay"}
                        onChange={() => setTimeFormat("fullDay")}
                     />

                     <RadioButton
                        id="half-day"
                        value="halfDay"
                        label="Medio día"
                        labelPosition="right"
                        labelClassName={labelClassName}
                        checked={timeFormat === "halfDay"}
                        onChange={() => setTimeFormat("halfDay")}
                     />

                     <RadioButton
                        id="range-of-hours"
                        value="rangeOfHours"
                        label="Rango de horas"
                        labelPosition="right"
                        labelClassName={labelClassName}
                        checked={timeFormat === "rangeOfHours"}
                        onChange={() => setTimeFormat("rangeOfHours")}
                     />

                  </motion.div>
               )}

               {
                  ((applicationType.Vacation && timeFormat === "rangeOfHours") || applicationType.MedicalAppointment) && (

                     <motion.div
                        variants={formFieldVariants}
                        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

                        <div className="min-w-0 flex flex-col gap-1.5">
                           <InputText
                              label="Hora de inicio"
                              labelClassName={labelClassName}
                              type="time"
                              step={3600}
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
                              step={3600}
                              className={inputClassName}
                              error={errors.end_time?.message}
                              {...register("end_time")}
                           />
                        </div>
                     </motion.div>
                  )
               }

               {applicationType.DonatedVacations &&
                  (
                     <motion.div variants={formFieldVariants}
                        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

                        <div className="min-w-0 flex flex-col gap-1.5">
                           <InputText
                              label="Días a donar"
                              labelClassName={labelClassName}
                              type="number"
                              isRequired
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

                     </motion.div>
                  )
               }

               <motion.div variants={formFieldVariants}>
                  <Textarea
                     label="Descripción"
                     isRequired
                     labelClassName={labelClassName}
                     rows={3}
                     placeholder="Propósito o detalles de la solicitud..."
                     className={`${inputClassName} resize-none`}
                     error={errors.description?.message}
                     {...register("description", { required: "La descripción es requerida." })}
                  />
               </motion.div>

            </motion.div>
         )}

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
               label={isPending ? "Enviando..." : "Enviar solicitud"}
               disabled={isPending}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </form>
   );
}
