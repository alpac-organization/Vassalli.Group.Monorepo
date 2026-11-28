import { Button, DatePicker, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { TerminationTypeEnumMap } from "@app/modules/payroll/domain/enums/termination-enums/termination-type.enum";
import { useTermination } from "@app/modules/payroll/ui/hooks/termination/useTermination";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import type { RegisterTerminationModalProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/register-termination-modal/register-termination-modal.types";
import {
  TERMINATION_TYPE_OPTIONS,
  procesoBajaDropdownClassName,
  procesoBajaInputClassName,
  procesoBajaLabelClassName,
  procesoBajaModalContentClassName,
  procesoBajaModalPanelClassName,
  procesoBajaPrimaryButtonClassName,
  procesoBajaSecondaryButtonClassName,
  procesoBajaSectionTitleClassName,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import {
  MAX_RESIGNATION_NOTICE_DAYS,
  formatEffectiveDeparture,
  getNoticeDateError,
  getNoticeDateHint,
  getNoticeDaysError,
  isEffectiveDepartureInTheFuture,
  noticeApplies,
  readNoticeDays,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.date-rules";
import { isTerminationType } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.labels";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { toDateOnly, toDayjsValue } from "@app/shared/utils/date.utils";
import { BanIcon, CheckIcon, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

type RegisterFormValues = {
  termination_type: TerminationTypeEnumMap | "";
  reason: string;
  notice_date: string;
  notice_days: string;
};

export const RegisterTerminationModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: RegisterTerminationModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { RegisterTermination } = useTermination();

  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    mode: "onChange",
    defaultValues: {
      termination_type: "",
      reason: "",
      notice_date: "",
      notice_days: "",
    },
  });

  const terminationType = useWatch({ control, name: "termination_type" });
  const noticeDate = useWatch({ control, name: "notice_date" });
  const noticeDays = useWatch({ control, name: "notice_days" });
  const showNotice = noticeApplies(terminationType);
  const noticeHint = getNoticeDateHint(terminationType);
  const parsedNoticeDays = readNoticeDays(noticeDays);
  const resignationNotice = terminationType === "VoluntaryResignation";
  const noticeIsValid =
    parsedNoticeDays !== null &&
    !Number.isNaN(parsedNoticeDays) &&
    !getNoticeDaysError(terminationType, noticeDate, noticeDays);
  const effectiveDepartureLabel = noticeIsValid
    ? formatEffectiveDeparture(noticeDate, parsedNoticeDays)
    : null;
  const effectiveDepartureIsFuture = noticeIsValid
    ? isEffectiveDepartureInTheFuture(noticeDate, parsedNoticeDays)
    : false;

  useEffect(() => {
    void trigger("notice_days");
  }, [noticeDate, terminationType, trigger]);

  const canSubmit = useMemo(
    () => Boolean(foundCollaborator && isValid && !RegisterTermination.isPending),
    [foundCollaborator, isValid, RegisterTermination.isPending],
  );

  const handleClearCollaborator = useCallback(() => {
    setFoundCollaborator(null);
    setIsSearching(false);
    reset();
  }, [reset]);

  const handleClose = useCallback(() => {
    handleClearCollaborator();
    onClose();
  }, [handleClearCollaborator, onClose]);

  const onSubmit = handleSubmit(async (values) => {
    if (!foundCollaborator || !isTerminationType(values.termination_type)) return;

    const applies = noticeApplies(values.termination_type);
    const noticeDateValue =
      applies && values.notice_date.trim() ? values.notice_date.trim() : null;
    const parsedDays = applies ? readNoticeDays(values.notice_days) : null;
    const noticeDaysValue =
      parsedDays !== null && !Number.isNaN(parsedDays) ? parsedDays : null;

    try {
      await RegisterTermination.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        collaborator_id: foundCollaborator.collaborator_id,
        termination_type: values.termination_type,
        reason: values.reason.trim(),
        notice_date: noticeDateValue,
        notice_days: noticeDaysValue,
        evidences: [],
      });
      onSuccess("La baja se registró correctamente.");
      handleClose();
    } catch (error) {
      const mapped = getMappedError(error as ApiErrorResponse);
      onError(mapped.description || "No se pudo registrar la baja.");
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      size="3xl"
      title="Registrar baja"
      panelClassName={procesoBajaModalPanelClassName}
      contentClassName={procesoBajaModalContentClassName}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!foundCollaborator ? (
          <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
            <section className="flex flex-col gap-3">
              <CollaboratorSearchForm
                label="Buscar por número de cédula"
                onSuccess={(collaborator) => {
                  setFoundCollaborator(collaborator);
                  setIsSearching(false);
                }}
                onError={() => {
                  setIsSearching(false);
                  setFoundCollaborator(null);
                }}
                onSearchStart={() => {
                  setIsSearching(true);
                }}
              />
            </section>
          </div>
        ) : (
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit();
            }}
          >
            <div className="scrollbar-dashboard flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 pb-2">
              <section className="flex flex-col gap-3">
                <h4 className={procesoBajaSectionTitleClassName}>Colaborador</h4>
                <div className="relative flex w-full flex-row items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <CollaboratorSummary
                      fullName={foundCollaborator.full_name ?? ""}
                      workPosition={foundCollaborator.work_position ?? ""}
                      isFullNameLoading={isSearching}
                      isWorkPositionLoading={isSearching}
                    />
                  </div>
                  <div className="group flex items-center">
                    <button
                      type="button"
                      className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
                      onClick={handleClearCollaborator}
                      aria-label="Quitar colaborador"
                    >
                      <X size={20} />
                    </button>
                    <div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                      Quitar colaborador
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h4 className={procesoBajaSectionTitleClassName}>Datos de la baja</h4>
                <Controller
                  name="termination_type"
                  control={control}
                  rules={{ required: "Seleccione el tipo de baja" }}
                  render={({ field }) => (
                    <Dropdown
                      label="Tipo de baja"
                      appearance="dark"
                      isRequired
                      placeholder="Seleccione el tipo"
                      labelClassName={procesoBajaLabelClassName}
                      valueClassName={procesoBajaLabelClassName}
                      className={procesoBajaDropdownClassName}
                      options={TERMINATION_TYPE_OPTIONS}
                      value={field.value}
                      onChange={(value) => {
                        const nextValue = String(value);
                        if (isTerminationType(nextValue)) field.onChange(nextValue);
                      }}
                      error={errors.termination_type?.message}
                    />
                  )}
                />

                {showNotice && (
                  <Controller
                    name="notice_date"
                    control={control}
                    rules={{
                      validate: (value) =>
                        getNoticeDateError(terminationType, value) ?? true,
                    }}
                    render={({ field }) => (
                      <DatePicker
                        label="Fecha de preaviso"
                        labelAbove
                        fieldWidth="large"
                        disableFuture
                        className={procesoBajaDropdownClassName}
                        labelClassName={procesoBajaLabelClassName}
                        value={toDayjsValue(field.value)}
                        onChange={(value) => field.onChange(toDateOnly(value))}
                        error={errors.notice_date?.message}
                        slotProps={{
                          popper: {
                            disablePortal: false,
                            sx: { zIndex: 2000 },
                          },
                        }}
                      />
                    )}
                  />
                )}
                {showNotice && (
                  <InputText
                    label="Días de preaviso"
                    type="number"
                    min={0}
                    max={resignationNotice ? MAX_RESIGNATION_NOTICE_DAYS : undefined}
                    step={1}
                    labelClassName={procesoBajaLabelClassName}
                    className={procesoBajaInputClassName}
                    {...register("notice_days", {
                      validate: (value) =>
                        getNoticeDaysError(terminationType, noticeDate, value) ?? true,
                    })}
                    error={errors.notice_days?.message}
                  />
                )}
                {noticeHint && (
                  <p className="m-0 text-sm text-slate-500 dark:text-slate-300">
                    {noticeHint}
                  </p>
                )}
                {effectiveDepartureLabel && (
                  <p className="m-0 text-sm text-slate-500 dark:text-slate-300">
                    Fecha efectiva de egreso: {effectiveDepartureLabel}.
                    {effectiveDepartureIsFuture
                      ? " El cierre no se podrá hacer hasta ese día. Para cerrarla hoy, deje el preaviso vacío o indique 0 días."
                      : " Puede cerrarla ese mismo día o cualquier día después."}
                  </p>
                )}

                <Textarea
                  label="Motivo"
                  labelClassName={procesoBajaLabelClassName}
                  className={procesoBajaInputClassName}
                  rows={3}
                  {...register("reason", {
                    required: "El motivo es obligatorio",
                    maxLength: { value: 500, message: "Máximo 500 caracteres" },
                  })}
                  error={errors.reason?.message}
                />
              </section>
            </div>

            <div className="-mx-4 -mb-4 mt-3 shrink-0 rounded-b-xl border-t border-t-slate-300 bg-white px-4 py-3 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6">
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  className={`${procesoBajaSecondaryButtonClassName} w-full min-w-0 sm:w-auto`}
                  icon={<BanIcon size={20} />}
                  isHiddenLabelOnMobile
                  onClick={handleClose}
                  disabled={RegisterTermination.isPending}
                />
                <Button
                  type="submit"
                  size="giant"
                  label="Registrar"
                  className={`${procesoBajaPrimaryButtonClassName} w-full min-w-0 sm:w-auto`}
                  icon={<CheckIcon size={20} />}
                  isHiddenLabelOnMobile
                  disabled={!canSubmit}
                  isLoading={RegisterTermination.isPending}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
