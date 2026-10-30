import { useEffect, useMemo } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { AnimatePresence, m } from "framer-motion";
import {
  DatePicker,
  Dropdown,
  InputText,
  RadioButton,
  Textarea,
  type DatePickerValue,
} from "@alpac/design-system";
import { MedicalAppointmentImageUploader } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/medical-appointment-image-uploader/medical-appointment-image-uploader";
import { findMatchingLeavePolicy } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/utils/find-matching-leave-policy";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { PermissionRequestFormValues } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-form.types";
import type { CatalogItem } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-forms";
import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";

const inputClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const FAMILY_ONLY_TYPES = new Set(["BirthLeave", "BereavementLeave"]);

const POLICY_MISSING_MESSAGE =
  "No hay una política activa para esta combinación de tipo, alcance y parentesco. No se puede enviar la solicitud.";

const fieldMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.28, ease: "easeOut" as const },
};

export type LeavePermissionFieldsProps = {
  control: Control<PermissionRequestFormValues>;
  errors: FieldErrors<PermissionRequestFormValues>;
  permitApplicationType: string;
  startDate: Date | null;
  endDate: Date | null;
  isSameDay: boolean;
  timeFormatType: "fullDay" | "rangeOfHours" | "halfDay";
  onTimeFormatChange: (value: "fullDay" | "rangeOfHours") => void;
  onStartDateChange: (value: DatePickerValue) => void;
  onEndDateChange: (value: DatePickerValue) => void;
  isEndDateDisabled: boolean;
  isEndTimeDisabled: boolean;
  onStartTimeChange: () => void;
  beneficiaryScope: string;
  familyRelationship: string;
  onBeneficiaryScopeChange: (value: string) => void;
  onFamilyRelationshipChange: (value: string) => void;
  register: ReturnType<
    typeof import("react-hook-form").useForm<PermissionRequestFormValues>
  >["register"];
  getValues: ReturnType<
    typeof import("react-hook-form").useForm<PermissionRequestFormValues>
  >["getValues"];
  policies: GetPermissionPoliciesResponse[];
  beneficiaryScopes: CatalogItem[];
  familyRelationships: CatalogItem[];
  requiresTimeRange: boolean;
};

export function LeavePermissionFields({
  control,
  errors,
  permitApplicationType,
  startDate,
  endDate,
  isSameDay,
  timeFormatType,
  onTimeFormatChange,
  onStartDateChange,
  onEndDateChange,
  isEndDateDisabled,
  isEndTimeDisabled,
  onStartTimeChange,
  beneficiaryScope,
  familyRelationship,
  onBeneficiaryScopeChange,
  onFamilyRelationshipChange,
  register,
  getValues,
  policies,
  beneficiaryScopes,
  familyRelationships,
  requiresTimeRange,
}: LeavePermissionFieldsProps) {
  const { handleRequestWarning, handleCloseAlert, InlineAlertComponent } =
    useAlertState();

  const hideOwnScope = FAMILY_ONLY_TYPES.has(permitApplicationType);
  const isFamilyNucleus = beneficiaryScope === "FamilyNucleus";

  const beneficiaryScopeOptions = useMemo(
    () =>
      beneficiaryScopes
        .filter((item) => item.name !== "None")
        .filter((item) => !(hideOwnScope && item.name === "Own"))
        .map((item) => ({
          label: item.label,
          value: item.name,
        })),
    [beneficiaryScopes, hideOwnScope],
  );

  const familyRelationshipOptions = useMemo(
    () =>
      familyRelationships
        .filter((item) => item.name !== "None")
        .map((item) => ({
          label: item.label,
          value: item.name,
        })),
    [familyRelationships],
  );

  const matchedPolicy = useMemo(
    () =>
      findMatchingLeavePolicy({
        policies,
        permitApplicationType,
        beneficiaryScope,
        familyRelationship: isFamilyNucleus ? familyRelationship : "None",
      }),
    [
      policies,
      permitApplicationType,
      beneficiaryScope,
      familyRelationship,
      isFamilyNucleus,
    ],
  );

  const minEvidence = matchedPolicy?.min_evidence_count ?? 0;
  const maxEvidence = matchedPolicy?.max_evidence_count ?? 0;
  const showEvidenceUploader = Boolean(matchedPolicy) && maxEvidence > 0;
  const showPolicyMissing =
    Boolean(permitApplicationType) &&
    Boolean(beneficiaryScope) &&
    (!isFamilyNucleus ||
      (familyRelationship && familyRelationship !== "None")) &&
    !matchedPolicy;

  useEffect(() => {
    if (showPolicyMissing) {
      handleRequestWarning(POLICY_MISSING_MESSAGE);
      return;
    }
    handleCloseAlert();
  }, [showPolicyMissing, handleRequestWarning, handleCloseAlert]);

  const showDayFormatRadios = Boolean(isSameDay && startDate && endDate);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="start_date"
          control={control}
          rules={{ required: "La fecha de inicio es requerida." }}
          render={({ field }) => (
            <DatePicker
              label="Fecha inicio"
              isRequired
              labelClassName={labelClassName}
              className={inputClassName}
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                onStartDateChange(value);
              }}
              error={errors.start_date?.message as string}
            />
          )}
        />

        <Controller
          name="end_date"
          control={control}
          rules={{ required: "La fecha de fin es requerida." }}
          render={({ field }) => (
            <DatePicker
              label="Fecha fin"
              isRequired
              labelClassName={labelClassName}
              className={inputClassName}
              value={field.value}
              disabled={isEndDateDisabled}
              onChange={(value) => {
                field.onChange(value);
                onEndDateChange(value);
              }}
              error={errors.end_date?.message as string}
            />
          )}
        />
      </div>

      <AnimatePresence initial={false}>
        {showDayFormatRadios ? (
          <m.div
            key="leave-day-format"
            {...fieldMotion}
            className="overflow-hidden"
          >
            <div className="flex flex-row flex-wrap gap-4 pb-1">
              <RadioButton
                id="leave-full-day"
                value="fullDay"
                label="Día completo"
                labelPosition="right"
                labelClassName={labelClassName}
                checked={timeFormatType === "fullDay"}
                onChange={() => onTimeFormatChange("fullDay")}
              />
              <RadioButton
                id="leave-range-of-hours"
                value="rangeOfHours"
                label="Rango de horas"
                labelPosition="right"
                labelClassName={labelClassName}
                checked={timeFormatType === "rangeOfHours"}
                onChange={() => onTimeFormatChange("rangeOfHours")}
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {requiresTimeRange ? (
          <m.div
            key="leave-time-range"
            {...fieldMotion}
            className="overflow-hidden"
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 pb-1 sm:grid-cols-2">
              <InputText
                type="time"
                label="Hora de inicio"
                isRequired
                labelClassName={labelClassName}
                className={inputClassName}
                {...register("start_time", {
                  required: "La hora de inicio es requerida.",
                })}
                error={errors.start_time?.message}
                onChange={(e) => {
                  onStartTimeChange();
                  register("start_time").onChange(e);
                }}
              />
              <InputText
                type="time"
                label="Hora de fin"
                isRequired
                disabled={isEndTimeDisabled}
                labelClassName={labelClassName}
                className={`${inputClassName} ${isEndTimeDisabled ? "cursor-not-allowed!" : ""}`}
                {...register("end_time", {
                  required: "La hora de fin es requerida.",
                  validate: (value) => {
                    const startTime = getValues("start_time");
                    if (!startTime || !value) return true;
                    const [startHour, startMinute] = startTime
                      .split(":")
                      .map(Number);
                    const [endHour, endMinute] = value.split(":").map(Number);
                    if (
                      startHour > endHour ||
                      (startHour === endHour && startMinute >= endMinute)
                    ) {
                      return "La hora de inicio debe ser menor a la hora de fin.";
                    }
                    return true;
                  },
                })}
                error={errors.end_time?.message}
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="beneficiary_scope"
          control={control}
          rules={{ required: "Seleccione el alcance del beneficiario" }}
          render={({ field }) => (
            <Dropdown
              label="Alcance"
              appearance="dark"
              placeholder="Seleccione un alcance"
              value={field.value ?? ""}
              onChange={(value) => {
                const next = String(value);
                field.onChange(next);
                onBeneficiaryScopeChange(next);
              }}
              options={beneficiaryScopeOptions}
              isRequired
              labelClassName={labelClassName}
              valueClassName={labelClassName}
              className={dropdownClassName}
              error={errors.beneficiary_scope?.message}
              errorVariant="tooltip"
            />
          )}
        />

        <AnimatePresence initial={false}>
          {isFamilyNucleus ? (
            <m.div
              key="leave-family-relationship"
              {...fieldMotion}
              className="overflow-hidden"
            >
              <Controller
                name="family_relationship"
                control={control}
                rules={{
                  validate: (value) =>
                    (value && value !== "None") ||
                    "Seleccione el parentesco familiar",
                }}
                render={({ field }) => (
                  <Dropdown
                    label="Parentesco"
                    appearance="dark"
                    placeholder="Seleccione un parentesco"
                    value={
                      field.value && field.value !== "None" ? field.value : ""
                    }
                    onChange={(value) => {
                      const next = String(value);
                      field.onChange(next);
                      onFamilyRelationshipChange(next);
                    }}
                    options={familyRelationshipOptions}
                    isRequired
                    labelClassName={labelClassName}
                    valueClassName={labelClassName}
                    className={dropdownClassName}
                    error={errors.family_relationship?.message}
                    errorVariant="tooltip"
                  />
                )}
              />
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {isFamilyNucleus ? (
          <m.div
            key="leave-related-person"
            {...fieldMotion}
            className="overflow-hidden"
          >
            <div className="pb-1">
              <InputText
                label="Nombre de la persona relacionada"
                isRequired
                labelClassName={labelClassName}
                className={inputClassName}
                {...register("related_person", {
                  required: "Ingrese el nombre de la persona relacionada",
                  validate: (value) =>
                    Boolean(value?.trim()) ||
                    "Ingrese el nombre de la persona relacionada",
                })}
                error={errors.related_person?.message}
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      {InlineAlertComponent}

      <AnimatePresence initial={false}>
        {showEvidenceUploader ? (
          <m.div
            key="leave-evidence-uploader"
            {...fieldMotion}
            className="overflow-hidden"
          >
            <div className="pb-1">
              <Controller
                name="medical_images"
                control={control}
                rules={{
                  validate: (value) => {
                    const count = value?.length ?? 0;
                    if (minEvidence > 0 && count < minEvidence) {
                      return `Debe adjuntar al menos ${minEvidence} evidencia(s).`;
                    }
                    if (count > maxEvidence) {
                      return `No puede adjuntar más de ${maxEvidence} evidencia(s).`;
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <MedicalAppointmentImageUploader
                    value={field.value ?? []}
                    onChange={field.onChange}
                    minFiles={minEvidence}
                    maxFiles={maxEvidence}
                    error={errors.medical_images?.message as string}
                  />
                )}
              />
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

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
            message: "La descripción no debe superar 500 caracteres",
          },
        })}
      />
    </div>
  );
}
