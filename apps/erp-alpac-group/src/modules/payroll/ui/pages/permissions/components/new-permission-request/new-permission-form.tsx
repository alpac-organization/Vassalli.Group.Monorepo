import dayjs from "dayjs";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useForm, Controller, type ControllerRenderProps } from "react-hook-form";
import { Alert, Button, DatePicker, Dropdown, InputText, RadioButton, Textarea } from "@alpac/design-system";
import { validateSessionContextUtils } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/utils/validateSessionContext";
import { PERMISSION_TYPE_OPTIONS } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { validateLaboralHours, validateTime } from "@app/shared/utils/string.utils";
import { generatePermissionPayload } from "./utils/generatePermissionPayload";
import { validateIntegerNumber, validatePositiveNumber } from "@app/shared/utils/number.utils";
import { validateMaximumDonatedVacation } from "./utils/validateMaximumDonatedVacation";
import { CollaboratorSearchForm } from "../collaborator-search-form/collaborator-search-form";
import { NewPermissionCollaboratorSummary } from "./collaborator-summary";

import type { PermissionRequestFormValues } from "./types/permission-form.types";
import type { PermissionType } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { NewPermissionRequestFormProps } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/new-permissionFormProps";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { RoleEnum } from "@app/core/enums/role.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";

const inputClassName =
   "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export function NewPermissionRequestForm(
   { isPending, onSubmit, onCancel, companyId, moduleCode, identificationNumber, channel }: NewPermissionRequestFormProps) {

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

   const searchErrorVariants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: 'hidden' },
      animate: { opacity: 1, y: 0, height: 'auto', overflow: 'visible' },
      exit: { opacity: 0, y: 8, height: 0, overflow: 'hidden' },
   }

   const { role } = useUserStore();

   const endOfYear = dayjs().endOf('year');
   const isOperator = role === RoleEnum.OPERATOR;

   const {
      register, handleSubmit, setError,
      getValues, setValue, control, formState: { errors, isValid }
   } = useForm<PermissionRequestFormValues>({
      defaultValues, mode: "onChange"
   });

   const initialSelectedType: Record<PermissionType, boolean> = {
      Vacation: false,
      DonatedVacations: false,
      MedicalAppointment: false
   };

   const [applicationType, setApplicationType] = useState(initialSelectedType);
   const [startDate, setStartDate] = useState<Date | null>(null);
   const [endDate, setEndDate] = useState<Date | null>(null);
   const [timeFormatType, setTimeFormatType] = useState<"halfDay" | "fullDay" | "rangeOfHours">("fullDay");
   const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
   const [isEndTimeDisabled, setIsEndTimeDisabled] = useState(true);

   const [foundBeneficiary, setFoundBeneficiary] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [searchError, setSearchError] = useState<string | null>(null);
   const [isSearching, setIsSearching] = useState(true);


   const isSelectedAtLeastOneType = useMemo(
      () => Object.values(applicationType).some((value) => value === true),
      [applicationType]
   );

   const isSameDay = useMemo(() => {
      if (!startDate || !endDate) return false;
      return startDate.toDateString() === endDate.toDateString()
   }, [startDate, endDate]);

   const handleTypeChange = (value: string, field: ControllerRenderProps<PermissionRequestFormValues, "type">) => {

      const type = value as PermissionType;

      field.onChange(value);

      setApplicationType({ ...initialSelectedType, [type]: true });

      if (type === "DonatedVacations") {
         setFoundBeneficiary(null);
         setValue("beneficiary_identification", undefined);
      }
   };

   const handleFormSubmit = (values: PermissionRequestFormValues) => {

      if (!validateSessionContextUtils(companyId, moduleCode, identificationNumber, setError)) {
         return;
      }

      const payload = generatePermissionPayload(values, {
         companyId, moduleCode, identificationNumber,
         channel: channel.value,
         timeFormatType, isSameDay
      });

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

         {isSelectedAtLeastOneType && applicationType.DonatedVacations && foundBeneficiary && (
            <motion.div
               variants={formFieldVariants}
               initial="hidden"
               animate="visible"
               className="relative min-w-0 flex flex-row items-center gap-4 w-full"
            >

               <div className="min-w-0 flex-1">
                  <NewPermissionCollaboratorSummary
                     fullName={foundBeneficiary.full_name}
                     workPosition={foundBeneficiary.work_position}
                     isFullNameLoading={isSearching}
                     isWorkPositionLoading={isSearching}
                     title="Nombre del Beneficiario"
                     subtitle="Cargo"
                  />
               </div>

               <div className="absolute right-0 top-0 sm:top-auto group flex items-center">
                  <button
                     type="button"
                     className={`rounded-full p-1.5 transition-all text-slate-700 hover:text-slate-900 hover:bg-slate-300 dark:text-white dark:hover:text-white dark:hover:bg-white/15`}
                     onClick={() => {
                        setFoundBeneficiary(null);
                        setValue("beneficiary_identification", undefined);
                     }}
                     aria-label="Cerrar modal"
                  >
                     <X size={20} />
                  </button>

                  <div className="absolute right-10 mt-2 px-2 py-1 text-xs text-white bg-slate-800 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                     Quitar colaborador beneficiario
                  </div>
               </div>

            </motion.div>
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
                  onChange={(value) => handleTypeChange(value, field)}
                  labelClassName={labelClassName}
                  valueClassName={labelClassName}
                  className={inputClassName}
                  options={PERMISSION_TYPE_OPTIONS ?? []}
               />
            )}
         />

         <AnimatePresence mode="wait">
            {isSelectedAtLeastOneType && (

               <motion.div
                  key="form-fields-container"
                  variants={formContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-4 sm:gap-5">

                  <AnimatePresence mode="popLayout">
                     {
                        (applicationType.Vacation || applicationType.MedicalAppointment) && (
                           <motion.div
                              key="dates-section"
                              variants={formFieldVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
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
                                             minDate={isOperator ? dayjs() : null}
                                             maxDate={endOfYear}
                                             shouldDisableDate={(date) => date.day() === 0}
                                             onChange={(value) => {
                                                setIsEndDateDisabled(false)
                                                setStartDate(value.$d)
                                                field.onChange(value)

                                                const currentEndDate = getValues("end_date");

                                                if (currentEndDate && dayjs(value).isAfter(dayjs(currentEndDate), 'day')) {
                                                   setValue("end_date", value);
                                                   setEndDate(value.$d);
                                                }

                                             }}
                                             error={errors.start_date?.message as string}
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
                                          validate: {
                                             afterStartDate: (value) => {
                                                const startDate = getValues("start_date")

                                                if (startDate && dayjs(value).isBefore(dayjs(startDate), 'day')) {
                                                   return "La fecha de fin no puede ser menor a la fecha de inicio."
                                                }

                                                return true
                                             }
                                          }
                                       }}
                                       render={({ field }) => (
                                          <DatePicker
                                             fieldWidth="large"
                                             label="Fecha fin"
                                             className={`w-full ${isEndDateDisabled ? "cursor-not-allowed!" : ""}`}
                                             value={field.value}
                                             referenceDate={startDate ? dayjs(startDate) : undefined}
                                             minDate={startDate ? dayjs(startDate) : undefined}
                                             maxDate={endOfYear}
                                             shouldDisableDate={(date) => date.day() === 0}
                                             disabled={isEndDateDisabled}
                                             onChange={(value) => {
                                                setEndDate(value.$d)
                                                field.onChange(value)
                                             }}
                                             error={errors.end_date?.message as string}
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
                           key="time-format-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                           className="flex flex-row gap-4">

                           <RadioButton
                              id="full-day"
                              value="fullDay"
                              label="Día completo"
                              labelPosition="right"
                              labelClassName={labelClassName}
                              checked={timeFormatType === "fullDay"}
                              onChange={() => setTimeFormatType("fullDay")}
                           />

                           <RadioButton
                              id="half-day"
                              value="halfDay"
                              label="Medio día"
                              labelPosition="right"
                              labelClassName={labelClassName}
                              checked={timeFormatType === "halfDay"}
                              onChange={() => setTimeFormatType("halfDay")}
                           />

                           <RadioButton
                              id="range-of-hours"
                              value="rangeOfHours"
                              label="Rango de horas"
                              labelPosition="right"
                              labelClassName={labelClassName}
                              checked={timeFormatType === "rangeOfHours"}
                              onChange={() => setTimeFormatType("rangeOfHours")}
                           />

                        </motion.div>
                     )}

                     {
                        ((applicationType.Vacation && timeFormatType === "rangeOfHours") || applicationType.MedicalAppointment) && (

                           <motion.div
                              key="hours-section"
                              variants={formFieldVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">

                              <div className="min-w-0 flex flex-col gap-1.5">
                                 <InputText
                                    type="time"
                                    label="Hora de inicio"
                                    isRequired
                                    labelClassName={labelClassName}
                                    className={inputClassName}
                                    {...register("start_time", {
                                       required: "La hora de inicio es requerida.",
                                       validate: {
                                          validateTime: (value?: string) => validateTime(value),
                                          validateLaboralHours: (value?: string) => validateLaboralHours(value)
                                       },
                                    })}
                                    error={errors.start_time?.message}
                                    onChange={(e) => {
                                       setIsEndTimeDisabled(false);
                                       register("start_time").onChange(e)
                                    }}
                                 />
                              </div>

                              <div className="min-w-0 flex flex-col gap-1.5">
                                 <InputText
                                    type="time"
                                    label="Hora de fin"
                                    isRequired
                                    disabled={isEndTimeDisabled}
                                    labelClassName={labelClassName}
                                    className={`${inputClassName} ${isEndTimeDisabled ? "cursor-not-allowed!" : ""}`}
                                    {...register("end_time", {
                                       required: "La hora de fin es requerida.",
                                       validate: {
                                          validateTime: (value) => validateTime(value),
                                          validateLaboralHours: (value?: string) => validateLaboralHours(value),
                                          validateStartTimeIsBeforeEndTime: (value) => {
                                             const startTime = getValues("start_time");
                                             const endTime = value;

                                             if (startTime && endTime) {
                                                const [startHour, startMinute] = startTime.split(":").map(Number);
                                                const [endHour, endMinute] = endTime.split(":").map(Number);

                                                if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
                                                   return "La hora de inicio debe ser menor a la hora de fin.";
                                                }
                                             }

                                             return true;
                                          },
                                       },
                                    })}
                                    error={errors.end_time?.message}
                                    onChange={(e) => {
                                       register("end_time").onChange(e)
                                    }}
                                 />
                              </div>
                           </motion.div>
                        )
                     }

                     {applicationType.DonatedVacations && !foundBeneficiary &&
                        (
                           <motion.div
                              key="search-section"
                              variants={formFieldVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="grid min-w-0 grid-cols-1 gap-4">

                              <div className="min-w-0">
                                 <CollaboratorSearchForm
                                    label="Buscar colaborador beneficiario"
                                    excludeIdentification={identificationNumber}
                                    onSuccess={(collaborator) => {
                                       setFoundBeneficiary(collaborator);
                                       setValue("beneficiary_identification", collaborator.personal_information.identification_number);
                                       setIsSearching(false);
                                    }}
                                    onError={(error) => {
                                       setSearchError(error);
                                       setIsSearching(false);
                                       setFoundBeneficiary(null);
                                    }}
                                    onSearchStart={() => {
                                       setSearchError(null);
                                       setIsSearching(true);
                                    }}
                                 />
                              </div>

                           </motion.div>
                        )
                     }

                     {((applicationType.DonatedVacations && foundBeneficiary)) && (
                        <motion.div
                           key="donated-days-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                           className="grid min-w-0 grid-cols-1 gap-4">
                           <motion.div variants={formFieldVariants}>
                              <InputText
                                 label="Días a donar"
                                 labelClassName={labelClassName}
                                 type="number"
                                 isRequired
                                 step={1}
                                 className={inputClassName}
                                 error={errors.donated_vacation_days?.message}
                                 {...register("donated_vacation_days", {
                                    required: "Los dias a donar son requeridos.",
                                    validate: {
                                       validateInteger: (value) => validateIntegerNumber(value),
                                       validatePositive: (value) => validatePositiveNumber(value),
                                       validateMaximum: (value) => validateMaximumDonatedVacation(value)
                                    },
                                 })}
                              />
                           </motion.div>
                        </motion.div>
                     )}

                     {((applicationType.DonatedVacations && foundBeneficiary) || applicationType.Vacation || applicationType.MedicalAppointment) && (
                        <motion.div
                           key="description-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                        >
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
                     )}
                  </AnimatePresence>

               </motion.div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {
               searchError && (
                  <motion.div
                     key="search-error"
                     variants={searchErrorVariants}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.45, ease: "easeOut", delay: 0.1 },
                        y: { duration: 0.3, ease: "easeOut", delay: 0.1 },
                     }}
                     onAnimationComplete={(definition) => {
                        if (definition === "animate") {
                           setTimeout(() => setSearchError(null), 5000);
                        }
                     }}
                  >
                     <Alert
                        type="error"
                        title="Error"
                        message={searchError}
                     />
                  </motion.div>
               )
            }
         </AnimatePresence>

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
               disabled={isPending || !isSelectedAtLeastOneType || !isValid || (applicationType.DonatedVacations && !foundBeneficiary)}
               isLoading={isPending}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </form>
   );
}
