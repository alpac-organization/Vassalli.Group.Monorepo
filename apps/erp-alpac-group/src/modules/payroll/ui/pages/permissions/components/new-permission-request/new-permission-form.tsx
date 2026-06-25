import dayjs from "dayjs";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, m, type Variants } from "framer-motion";
import {
   useForm,
   Controller,
   type ControllerRenderProps,
} from "react-hook-form";
import {
   Alert,
   Button,
   DatePicker,
   Dropdown,
   InputText,
   RadioButton,
   Textarea,
} from "@alpac/design-system";
import { validateSessionContextUtils } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/utils/validateSessionContext";
import { PERMISSION_TYPE_OPTIONS } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import {
   validateLaboralHours,
   validateTime,
} from "@app/shared/utils/string.utils";
import { generatePermissionPayload } from "./utils/generatePermissionPayload";
import {
   validateDecimalNumber,
   validateIntegerNumber,
   validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { validateMaximumDonatedVacation } from "./utils/validateMaximumDonatedVacation";
import { CollaboratorSearchForm } from "../collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "./collaborator-summary";
import { MedicalAppointmentImageUploader } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/medical-appointment-image-uploader/medical-appointment-image-uploader";

import type { PermissionRequestFormValues } from "./types/permission-form.types";
import type { NewPermissionRequestFormProps } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/new-permissionFormProps";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { VACATION_PAY_OPTIONS } from "../../constants/vacation-pay.filters.constants";
import type { PermissionType } from "./types/permission.types";
import type { ApplicationType } from "./types/application.types";
// import { RoleEnum } from "@app/core/enums/role.enum";
// import { useUserStore } from "@app/shared/stores/useUserStore";

const inputClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const SUNDAY_SAME_DAY_MESSAGE =
   "No se permiten permisos de un solo día en domingo. Use un rango de fechas si aplica.";

const isSundaySameDaySelection = (
   date: dayjs.ConfigType,
   options: {
      isMedicalAppointment: boolean;
      startDate: Date | null;
      endDate: Date | null;
   },
) => {
   if (dayjs(date).day() !== 0) return false;

   if (options.isMedicalAppointment) return true;

   if (!options.startDate || !options.endDate) return false;

   return (
      dayjs(date).isSame(dayjs(options.startDate), "day") &&
      dayjs(date).isSame(dayjs(options.endDate), "day")
   );
};

export function NewPermissionRequestForm({
   isPending,
   onSubmit,
   onCancel,
   companyId,
   moduleCode,
   identificationNumber,
   channel,
   payrollId,
   onValidationError,
}: NewPermissionRequestFormProps) {

   const defaultValues = {
      type: undefined,
      start_date: null,
      end_date: null,
      start_time: "",
      end_time: "",
      medical_images: [],
      description: "",
   };

   const formContainerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.07,
            delayChildren: 0.04,
         },
      },
      exit: {
         opacity: 0,
         transition: {
            duration: 0.15,
            staggerChildren: 0.04,
            staggerDirection: -1,
         },
      },
   };

   const formFieldVariants: Variants = {
      hidden: {
         opacity: 0,
         y: 14,
      },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            duration: 0.25,
            ease: "easeOut",
         },
      },
      exit: {
         opacity: 0,
         y: 6,
         transition: {
            duration: 0.15,
         },
      },
   };

   const searchErrorVariants = {
      initial: { opacity: 0, y: 16, height: 0, overflow: "hidden" },
      animate: { opacity: 1, y: 0, height: "auto", overflow: "visible" },
      exit: { opacity: 0, y: 8, height: 0, overflow: "hidden" },
   };

   // const { role } = useUserStore();

   // const endOfYear = dayjs().endOf('year');
   // const isOperator = role === RoleEnum.OPERATOR;

   const {
      register,
      handleSubmit,
      setError,
      getValues,
      setValue,
      control,
      formState: { errors, isValid },
   } = useForm<PermissionRequestFormValues>({
      defaultValues,
      mode: "onChange",
   });

   const initialSelectedType: Record<ApplicationType | PermissionType, boolean> = {
      Vacation: false,
      DonatedVacations: false,
      MedicalAppointment: false,
      VacationPay: false
   };

   const [applicationType, setApplicationType] = useState(initialSelectedType);
   const [startDate, setStartDate] = useState<Date | null>(null);
   const [endDate, setEndDate] = useState<Date | null>(null);
   const [timeFormatType, setTimeFormatType] = useState<
      "halfDay" | "fullDay" | "rangeOfHours"
   >("fullDay");
   const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
   const [isEndTimeDisabled, setIsEndTimeDisabled] = useState(true);

   const [foundBeneficiary, setFoundBeneficiary] =
      useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [searchError, setSearchError] = useState<string | null>(null);
   const [isSearching, setIsSearching] = useState(true);

   const isSelectedAtLeastOneType = useMemo(
      () => Object.values(applicationType).some((value) => value === true),
      [applicationType],
   );

   const isSameDay = useMemo(() => {
      if (!startDate || !endDate) return false;
      return startDate.toDateString() === endDate.toDateString();
   }, [startDate, endDate]);

   const isSaturdaySameDay = useMemo(() => {
      if (!isSameDay || !startDate) return false;
      return dayjs(startDate).day() === 6;
   }, [isSameDay, startDate]);

   const isSundaySameDayBlocked = useMemo(() => {
      if (!startDate) return false;

      if (applicationType.MedicalAppointment) {
         return dayjs(startDate).day() === 0;
      }

      if (!applicationType.Vacation || !endDate || !isSameDay) return false;

      return dayjs(startDate).day() === 0;
   }, [
      startDate,
      endDate,
      isSameDay,
      applicationType.MedicalAppointment,
      applicationType.Vacation,
   ]);

   const requiresTimeRange = useMemo(() => {
      if (applicationType.MedicalAppointment) {
         return timeFormatType === "rangeOfHours";
      }

      if (applicationType.Vacation && isSameDay) {
         return timeFormatType === "rangeOfHours";
      }

      return false;
   }, [
      applicationType.MedicalAppointment,
      applicationType.Vacation,
      isSameDay,
      timeFormatType,
   ]);

   const clearTimeFields = () => {
      setValue("start_time", "");
      setValue("end_time", "");
      setIsEndTimeDisabled(true);
   };

   const handleTypeChange = (value: string, field: ControllerRenderProps<PermissionRequestFormValues, "type">) => {

      const type = value as PermissionType;

      field.onChange(value);

      setApplicationType({ ...initialSelectedType, [type]: true });

      if (type === "DonatedVacations") {
         setFoundBeneficiary(null);
         setValue("beneficiary_identification", undefined);
      }

      if (type === "MedicalAppointment") {
         setTimeFormatType("fullDay");
         setStartDate(null);
         setEndDate(null);
         setValue("end_date", null);
         setValue("medical_images", []);
         clearTimeFields();
      }
   };

   const handleFormSubmit = (values: PermissionRequestFormValues) => {
      if (isSundaySameDayBlocked) {
         return;
      }

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

      const resolvedPayrollId = payrollId?.trim();
      if (!resolvedPayrollId) {
         onValidationError?.(
            "No hay una nómina en progreso asociada. No se puede registrar el permiso.",
         );
         return;
      }

      const payload = generatePermissionPayload(values, {
         companyId,
         moduleCode,
         identificationNumber,
         channel: channel.value,
         timeFormatType,
         isSameDay,
         payrollId: resolvedPayrollId,
      });

      onSubmit(payload);
   };

   const applyTimeFormat = (start: Date | string, end: Date | string) => {
      if (!start || !end) return;

      const sameDay = dayjs(start).isSame(dayjs(end), "day");

      if (sameDay && dayjs(start).day() === 6) {
         setTimeFormatType("halfDay");
      } else if (sameDay) {
         setTimeFormatType("fullDay");
      }
   };

   const applicationOptions = [...PERMISSION_TYPE_OPTIONS, ...VACATION_PAY_OPTIONS];

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

         {isSelectedAtLeastOneType &&
            applicationType.DonatedVacations &&
            foundBeneficiary && (
               <div className="relative min-w-0 flex flex-row items-center gap-4 w-full">
                  <div className="min-w-0 flex-1">
                     <CollaboratorSummary
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
               </div>
            )}



         <Controller
            name="type"
            control={control}
            rules={{
               required: false,
            }}
            render={({ field }) => (

               <Dropdown
                  placeholder="Tipo de solicitud"
                  appearance="dark"
                  value={field.value}
                  onChange={(value) => handleTypeChange(value, field)}
                  labelClassName={labelClassName}
                  valueClassName={labelClassName}
                  className={inputClassName}
                  options={applicationOptions ?? []}
               />

            )}
         />



         <AnimatePresence mode="wait">
            {isSelectedAtLeastOneType && (
               <m.div
                  key="form-fields-container"
                  variants={formContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-4 sm:gap-5"
               >
                  <AnimatePresence mode="popLayout">
                     {(applicationType.Vacation ||
                        applicationType.MedicalAppointment) && (
                           <m.div
                              key="dates-section"
                              variants={formFieldVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2"
                           >
                              {(applicationType.Vacation ||
                                 applicationType.MedicalAppointment) && (
                                    <div className="min-w-0 flex flex-col gap-1.5">
                                       <Controller
                                          name="start_date"
                                          control={control}
                                          rules={{
                                             required: "La fecha de inicio es requerida.",
                                             validate: (value) => {
                                                const end = getValues("end_date");
                                                if (
                                                   value &&
                                                   isSundaySameDaySelection(value, {
                                                      isMedicalAppointment:
                                                         applicationType.MedicalAppointment,
                                                      startDate: value.$d ?? value,
                                                      endDate: end?.$d ?? end ?? null,
                                                   })
                                                ) {
                                                   return SUNDAY_SAME_DAY_MESSAGE;
                                                }
                                                return true;
                                             },
                                          }}
                                          render={({ field }) => (
                                             <DatePicker
                                                fieldWidth="large"
                                                label={`${applicationType.MedicalAppointment ? "Fecha de cita" : "Fecha inicio"}`}
                                                className="w-full"
                                                value={field.value}
                                                //minDate={isOperator ? dayjs() : null}
                                                //maxDate={endOfYear}
                                                labelAbove
                                                isRequired
                                                shouldDisableDate={(date) =>
                                                   applicationType.MedicalAppointment &&
                                                   date.day() === 0
                                                }
                                                onChange={(value) => {
                                                   setIsEndDateDisabled(false);
                                                   setStartDate(value.$d);
                                                   field.onChange(value);

                                                   if (applicationType.MedicalAppointment) {
                                                      setTimeFormatType("fullDay");
                                                      clearTimeFields();
                                                      return;
                                                   }

                                                   const currentEndDate = getValues("end_date");

                                                   if (
                                                      currentEndDate &&
                                                      dayjs(value).isAfter(
                                                         dayjs(currentEndDate),
                                                         "day",
                                                      )
                                                   ) {
                                                      setValue("end_date", value);
                                                      setEndDate(value.$d);
                                                   }

                                                   applyTimeFormat(
                                                      value.$d,
                                                      getValues("end_date")?.$d ?? value.$d,
                                                   );
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
                                             notSundaySameDay: (value) => {
                                                const start = getValues("start_date");
                                                if (
                                                   value &&
                                                   start &&
                                                   isSundaySameDaySelection(value, {
                                                      isMedicalAppointment: false,
                                                      startDate: start.$d ?? start,
                                                      endDate: value.$d ?? value,
                                                   })
                                                ) {
                                                   return SUNDAY_SAME_DAY_MESSAGE;
                                                }
                                                return true;
                                             },
                                             afterStartDate: (value) => {
                                                const startDate = getValues("start_date");

                                                if (
                                                   startDate &&
                                                   dayjs(value).isBefore(dayjs(startDate), "day")
                                                ) {
                                                   return "La fecha de fin no puede ser menor a la fecha de inicio.";
                                                }

                                                return true;
                                             },
                                          },
                                       }}
                                       render={({ field }) => (
                                          <DatePicker
                                             fieldWidth="large"
                                             label="Fecha fin"
                                             className={`w-full ${isEndDateDisabled ? "cursor-not-allowed!" : ""}`}
                                             value={field.value}
                                             labelAbove
                                             isRequired
                                             referenceDate={
                                                startDate ? dayjs(startDate) : undefined
                                             }
                                             //minDate={startDate ? dayjs(startDate) : undefined}
                                             //maxDate={endOfYear}
                                             shouldDisableDate={(date) =>
                                                !!startDate &&
                                                date.day() === 0 &&
                                                dayjs(date).isSame(dayjs(startDate), "day")
                                             }
                                             disabled={isEndDateDisabled}
                                             onChange={(value) => {
                                                setEndDate(value.$d);
                                                field.onChange(value);
                                                applyTimeFormat(
                                                   getValues("start_date")?.$d,
                                                   value.$d,
                                                );
                                             }}
                                             error={errors.end_date?.message as string}
                                          />
                                       )}
                                    />
                                 </div>
                              )}
                           </m.div>
                        )}

                     {((applicationType.Vacation && isSameDay) ||
                        (applicationType.MedicalAppointment && startDate)) && (
                           <m.div
                              key="time-format-section"
                              variants={formFieldVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="flex flex-row flex-wrap gap-4"
                           >
                              <RadioButton
                                 id="full-day"
                                 value="fullDay"
                                 label="Día completo"
                                 labelPosition="right"
                                 labelClassName={labelClassName}
                                 checked={timeFormatType === "fullDay"}
                                 disabled={applicationType.Vacation && isSaturdaySameDay}
                                 onChange={() => {
                                    setTimeFormatType("fullDay");
                                    clearTimeFields();
                                 }}
                              />

                              {applicationType.Vacation && (
                                 <RadioButton
                                    id="half-day"
                                    value="halfDay"
                                    label="Medio día"
                                    labelPosition="right"
                                    labelClassName={labelClassName}
                                    checked={timeFormatType === "halfDay"}
                                    onChange={() => {
                                       setTimeFormatType("halfDay");
                                       clearTimeFields();
                                    }}
                                 />
                              )}

                              <RadioButton
                                 id="range-of-hours"
                                 value="rangeOfHours"
                                 label="Rango de horas"
                                 labelPosition="right"
                                 labelClassName={labelClassName}
                                 checked={timeFormatType === "rangeOfHours"}
                                 onChange={() => setTimeFormatType("rangeOfHours")}
                              />
                           </m.div>
                        )}

                     {requiresTimeRange && (
                        <m.div
                           key="hours-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                           className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                           <div className="min-w-0 flex flex-col gap-1.5">
                              <InputText
                                 type="time"
                                 label="Hora de inicio"
                                 isRequired
                                 labelClassName={labelClassName}
                                 className={inputClassName}
                                 {...register("start_time", {
                                    required: requiresTimeRange
                                       ? "La hora de inicio es requerida."
                                       : false,
                                    validate: {
                                       validateTime: (value?: string) =>
                                          !requiresTimeRange || validateTime(value),
                                       validateLaboralHours: (value?: string) =>
                                          !requiresTimeRange || validateLaboralHours(value),
                                    },
                                 })}
                                 error={errors.start_time?.message}
                                 onChange={(e) => {
                                    setIsEndTimeDisabled(false);
                                    register("start_time").onChange(e);
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
                                    required: requiresTimeRange
                                       ? "La hora de fin es requerida."
                                       : false,
                                    validate: {
                                       validateTime: (value) =>
                                          !requiresTimeRange || validateTime(value),
                                       validateLaboralHours: (value?: string) =>
                                          !requiresTimeRange || validateLaboralHours(value),
                                       validateStartTimeIsBeforeEndTime: (value) => {
                                          if (!requiresTimeRange) return true;

                                          const startTime = getValues("start_time");
                                          const endTime = value;

                                          if (startTime && endTime) {
                                             const [startHour, startMinute] = startTime
                                                .split(":")
                                                .map(Number);
                                             const [endHour, endMinute] = endTime
                                                .split(":")
                                                .map(Number);

                                             if (
                                                startHour > endHour ||
                                                (startHour === endHour &&
                                                   startMinute >= endMinute)
                                             ) {
                                                return "La hora de inicio debe ser menor a la hora de fin.";
                                             }
                                          }

                                          return true;
                                       },
                                    },
                                 })}
                                 error={errors.end_time?.message}
                                 onChange={(e) => {
                                    register("end_time").onChange(e);
                                 }}
                              />
                           </div>
                        </m.div>
                     )}

                     {applicationType.DonatedVacations && !foundBeneficiary && (
                        <m.div
                           key="search-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                           className="grid min-w-0 grid-cols-1 gap-4"
                        >
                           <div className="min-w-0">
                              <CollaboratorSearchForm
                                 label="Buscar colaborador beneficiario"
                                 onSuccess={(collaborator) => {
                                    setFoundBeneficiary(collaborator);
                                    setValue(
                                       "beneficiary_identification",
                                       collaborator.personal_information
                                          .identification_number,
                                    );
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
                                 excludeIdentifications={[identificationNumber]}
                              />
                           </div>
                        </m.div>
                     )}

                     {applicationType.DonatedVacations && foundBeneficiary && (
                        <m.div
                           key="donated-days-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                           className="grid min-w-0 grid-cols-1 gap-4"
                        >
                           <m.div variants={formFieldVariants}>
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
                                       validateInteger: (value) =>
                                          validateIntegerNumber(value),
                                       validatePositive: (value) =>
                                          validatePositiveNumber(value),
                                       validateMaximum: (value) =>
                                          validateMaximumDonatedVacation(value),
                                    },
                                 })}
                              />
                           </m.div>
                        </m.div>
                     )}

                     {applicationType.MedicalAppointment && (
                        <m.div
                           key="medical-images-section"
                           variants={formFieldVariants}
                           initial="hidden"
                           animate="visible"
                           exit="exit"
                        >
                           <Controller
                              name="medical_images"
                              control={control}
                              rules={{
                                 validate: (value) =>
                                    (value?.length ?? 0) >= 1 ||
                                    "Debe adjuntar al menos 1 comprobante médico.",
                              }}
                              render={({ field }) => (
                                 <MedicalAppointmentImageUploader
                                    value={field.value ?? []}
                                    onChange={field.onChange}
                                    error={errors.medical_images?.message as string}
                                 />
                              )}
                           />
                        </m.div>
                     )}

                     {applicationType.VacationPay && !foundBeneficiary && (

                        <InputText
                           label="Cantidad de días a solicitar"
                           labelClassName={labelClassName}
                           type="text"
                           isRequired
                           className={inputClassName}
                           error={errors.amount_days?.message}
                           {...register("amount_days", {
                              required: "Cantidad de días a solicitar son requeridos.",
                              validate: {
                                 validateDecimal: (value) => validateDecimalNumber(value),
                                 validatePositive: (value) => validatePositiveNumber(value),
                              },
                           })}
                        />

                     )}

                     {((applicationType.DonatedVacations && foundBeneficiary) ||
                        applicationType.Vacation ||
                        applicationType.MedicalAppointment) && (
                           <m.div
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
                                 maxLength={500}
                                 placeholder="Propósito o detalles de la solicitud..."
                                 className={`${inputClassName} resize-none`}
                                 error={errors.description?.message}
                                 {...register("description", {
                                    required: "La descripción es requerida.",
                                    maxLength: {
                                       value: 500,
                                       message:
                                          "La descripción debe tener al menos 500 caracteres",
                                    },
                                 })}
                              />
                           </m.div>
                        )}
                  </AnimatePresence>
               </m.div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {searchError && (
               <m.div
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
                  <Alert type="error" title="Error" message={searchError} />
               </m.div>
            )}
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
               disabled={
                  isPending ||
                  !isSelectedAtLeastOneType ||
                  !isValid ||
                  (applicationType.DonatedVacations && !foundBeneficiary) ||
                  isSundaySameDayBlocked
               }
               isLoading={isPending}
               className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
            />
         </div>
      </form>
   );
}
