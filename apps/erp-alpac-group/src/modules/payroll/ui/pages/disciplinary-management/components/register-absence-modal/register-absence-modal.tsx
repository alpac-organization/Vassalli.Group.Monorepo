import {
  Button,
  DatePicker,
  type DatePickerValue,
  InputText,
  Modal,
} from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RegisterAbsenceRequest } from "@app/modules/payroll/domain/ApiContract/Requests/absence-requests/register-absence.request";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import { AbsenceSourceEnum } from "@app/modules/payroll/domain/enums/absence-enums/absence.enum";
import { useAbsence } from "@app/modules/payroll/ui/hooks/absence/useAbsence";
import type { RegisterAbsenceModalProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-absence-modal/register-absence-modal.types";
import {
  disciplinaryApproveButtonClassName,
  disciplinaryDropdownClassName,
  disciplinaryInputClassName,
  disciplinaryLabelClassName,
  disciplinaryRejectButtonClassName,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-form.constants";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import dayjs from "dayjs";
import { BanIcon, CheckIcon, NotebookTextIcon, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

const sectionTitleClassName =
  "m-0 pb-2 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-200 border-b border-slate-200 dark:border-neutral-600";

type RegisterAbsenceFormValues = {
  date: DatePickerValue | null;
  reason: string;
};

export const RegisterAbsenceModal = ({
  isOpen,
  onClose,
  onSuccess,
}: RegisterAbsenceModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();

  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterAbsenceFormValues>({
    defaultValues: {
      date: dayjs(),
      reason: "",
    },
  });

  const { RegisterAbsence } = useAbsence();

  const resetAll = useCallback(() => {
    setFoundCollaborator(null);
    setIsSearching(false);
    reset({
      date: dayjs(),
      reason: "",
    });
  }, [reset]);

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleClearCollaborator = () => {
    setFoundCollaborator(null);
    setIsSearching(false);
    reset({
      date: dayjs(),
      reason: "",
    });
  };

  const onSubmit: SubmitHandler<RegisterAbsenceFormValues> = async (values) => {
    if (!foundCollaborator?.collaborator_id || !values.date) return;

    const dateFormatted = dayjs((values.date as DatePickerValue)?.$d ?? values.date).format(
      "YYYY-MM-DD",
    );

    const payload: RegisterAbsenceRequest = {
      company_id: companyId,
      module_code: moduleCode,
      collaborator_id: foundCollaborator.collaborator_id,
      date: dateFormatted,
      reason: values.reason.trim() || null,
      source: AbsenceSourceEnum.Manual.value as number,
    };

    try {
      await RegisterAbsence.mutateAsync(payload);
      handleRequestSuccess("Inasistencia registrada exitosamente");
      onSuccess?.();
      handleClose();
    } catch (error) {
      const mapped = getMappedError(error as ApiErrorResponse);
      handleRequestError(
        mapped.description ||
          "No se pudo registrar la inasistencia. Intente de nuevo.",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      title="Registrar ausencia"
      size="3xl"
      panelClassName={[
        "flex max-h-[min(92dvh,48rem)] flex-col overflow-hidden",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
      contentClassName="flex min-h-0 flex-1 flex-col"
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
              {AlertComponent}
            </section>
          </div>
        ) : (
          <form
            id="register-absence-form"
            className="flex min-h-0 flex-1 flex-col justify-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 flex flex-col gap-5 pb-2">
              <section className="flex flex-col gap-3">
                <h4 className={sectionTitleClassName}>Colaborador</h4>
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
                <h4 className={sectionTitleClassName}>Datos de la inasistencia</h4>
                <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2">
                  <Controller
                    name="date"
                    control={control}
                    rules={{
                      required: "La fecha es requerida",
                      validate: (value) => {
                        if (!value) return "La fecha es requerida";
                        const d = dayjs((value as DatePickerValue)?.$d ?? value);
                        if (!d.isValid()) return "Fecha inválida";
                        if (d.isAfter(dayjs(), "day")) {
                          return "La fecha no puede ser futura";
                        }
                        if (d.day() === 0) {
                          return "No se puede seleccionar día domingo (descanso semanal obligatorio)";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <DatePicker
                        fieldWidth="large"
                        label="Fecha de inasistencia"
                        labelAbove
                        disableFuture
                        className={disciplinaryDropdownClassName}
                        labelClassName={disciplinaryLabelClassName}
                        value={field.value}
                        errorVariant="tooltip"
                        error={errors.date?.message?.toString()}
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />

                  <div className="flex flex-col justify-end pb-1">
                    <DetailField
                      label="Origen"
                      value={AbsenceSourceEnum.Manual.label}
                      icon={<NotebookTextIcon size={18} />}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <InputText
                      label="Motivo"
                      className={disciplinaryInputClassName}
                      labelClassName={disciplinaryLabelClassName}
                      placeholder="Describe el motivo (máx. 500)"
                      errorVariant="tooltip"
                      error={errors.reason?.message}
                      {...register("reason", {
                        maxLength: {
                          value: 500,
                          message: "El motivo no puede exceder 500 caracteres",
                        },
                      })}
                    />
                  </div>
                </div>
              </section>

              {AlertComponent}
            </div>

            {/* Pie fijo con acciones siempre visibles */}
            <div className="-mx-4 -mb-4 mt-3 shrink-0 border-t border-t-slate-300 bg-white px-4 py-3 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  label="Cancelar"
                  className={`${disciplinaryRejectButtonClassName} w-full min-w-0 sm:w-auto`}
                  icon={<BanIcon size={20} />}
                  disabled={RegisterAbsence.isPending}
                  onClick={handleClose}
                />
                <Button
                  type="submit"
                  label="Registrar"
                  className={`${disciplinaryApproveButtonClassName} w-full min-w-0 sm:w-auto`}
                  icon={<CheckIcon size={20} />}
                  disabled={RegisterAbsence.isPending}
                  isLoading={RegisterAbsence.isPending}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
