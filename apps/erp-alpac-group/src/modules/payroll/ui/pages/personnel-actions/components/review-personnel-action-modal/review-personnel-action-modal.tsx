import { Button, InputText, Modal } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ReviewPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/review-personnel-action.request";
import {
  formatIncreaseValueDisplay,
  getSalaryIncreaseTypeLabel,
} from "@app/modules/payroll/domain/enums/personnel-action-enums/salary-increase-type.enum";
import { usePersonnelAction } from "@app/modules/payroll/ui/hooks/personnel-action/usePersonnelAction";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import {
  CheckCircle2Icon,
  CheckIcon,
  NotebookTextIcon,
  TrendingUpIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  actionApproveButtonClassName,
  actionCancelOutlineClassName,
  actionInputClassName,
  actionLabelClassName,
  actionModalContentClassName,
  actionModalPanelClassName,
  actionRejectButtonClassName,
} from "../../utils/personnel-actions.constants";
import type { ReviewPersonnelActionModalProps } from "./review-personnel-action-modal.types";

type ReviewFormValues = {
  management_notes: string;
};

export const ReviewPersonnelActionModal = ({
  isOpen,
  onClose,
  onSuccess,
  request,
}: ReviewPersonnelActionModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestError } = useAlertState();

  const [decision, setDecision] = useState<boolean>(true);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    defaultValues: {
      management_notes: "",
    },
  });

  const { ReviewPersonnelAction } = usePersonnelAction();

  const handleClose = () => {
    reset({ management_notes: "" });
    setDecision(true);
    onClose();
  };

  const onSubmit: SubmitHandler<ReviewFormValues> = async (values) => {
    if (!request) return;

    if (!decision && !values.management_notes?.trim()) {
      handleRequestError("El motivo u observación de gerencia es obligatorio al rechazar");
      return;
    }

    const payload: ReviewPersonnelActionRequest = {
      company_id: companyId,
      module_code: moduleCode,
      request_id: request.id,
      is_approved: decision,
      management_notes: values.management_notes?.trim() || null,
    };

    try {
      await ReviewPersonnelAction.mutateAsync(payload);
      onSuccess?.(
        decision
          ? "Solicitud aprobada satisfactoriamente"
          : "Solicitud rechazada satisfactoriamente",
      );
      handleClose();
    } catch (err) {
      const mapped = getMappedError(err as ApiErrorResponse);
      handleRequestError(mapped.description || "Error al procesar la revisión");
    }
  };

  const increaseText = request
    ? formatIncreaseValueDisplay(request.increase_type, request.increase_value)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
      size="lg"
      title={`Revisión de Solicitud${request?.request_code ? `: ${request.request_code}` : ""}`}
      description="Emite el dictamen gerencial para autorizar o denegar la solicitud"
      panelClassName={actionModalPanelClassName}
      contentClassName={actionModalContentClassName}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1 flex flex-col gap-5">
          {AlertComponent}

          {request && (
            <div className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 dark:bg-[#363a45]/40 border border-slate-200 dark:border-neutral-700 p-3.5 sm:grid-cols-2">
              <DetailField
                label="Colaboradores"
                value={`${request.total_collaborators}${request.area_name ? ` — ${request.area_name}` : ""}`}
                icon={<UsersIcon size={18} />}
              />
              <DetailField
                label="Modalidad"
                value={`${getSalaryIncreaseTypeLabel(request.increase_type)}${increaseText ? ` (${increaseText})` : ""}`}
                icon={<TrendingUpIcon size={18} />}
              />
              <DetailField
                label="Motivo"
                value={request.justification}
                containerClass="sm:col-span-2"
                icon={<NotebookTextIcon size={18} />}
              />
            </div>
          )}

          <InputText
            label={decision ? "Observaciones (Opcional)" : "Motivo de Rechazo (Obligatorio)"}
            className={actionInputClassName}
            labelClassName={actionLabelClassName}
            placeholder={
              decision
                ? "Ej. Aprobado conforme al presupuesto y organigrama autorizado."
                : "Indique la justificación del rechazo para conocimiento del solicitante..."
            }
            errorVariant="tooltip"
            error={errors.management_notes?.message}
            {...register("management_notes", {
              validate: (val) => {
                if (!decision && (!val || !val.trim())) {
                  return "El motivo de rechazo es obligatorio";
                }
                return true;
              },
            })}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-800 dark:text-white">
              Resolución Gerencial:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision(true)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                  decision
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 dark:border-neutral-700 dark:bg-[#272B34] dark:text-slate-300 dark:hover:bg-[#363a45]"
                }`}
              >
                <CheckCircle2Icon size={18} />
                <span>Aprobar Solicitud</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision(false)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                  !decision
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 ring-2 ring-red-500/20"
                    : "border-slate-200 bg-transparent text-slate-600 hover:bg-slate-100 dark:border-neutral-700 dark:bg-[#272B34] dark:text-slate-300 dark:hover:bg-[#363a45]"
                }`}
              >
                <XCircleIcon size={18} />
                <span>Rechazar Solicitud</span>
              </button>
            </div>
          </div>
        </div>

        <div className="-mx-4 -mb-4 mt-3 flex shrink-0 flex-col-reverse gap-2 border-t border-t-slate-300 bg-white px-4 py-3 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6 rounded-b-xl">
          <Button
            type="button"
            label="Cancelar"
            size="giant"
            className={`${actionCancelOutlineClassName} w-full min-w-0 sm:w-auto`}
            onClick={handleClose}
            disabled={ReviewPersonnelAction.isPending}
          />
          <Button
            type="submit"
            label={
              ReviewPersonnelAction.isPending
                ? "Procesando..."
                : decision
                ? "Confirmar Aprobación"
                : "Confirmar Rechazo"
            }
            icon={decision ? <CheckIcon size={16} /> : <XCircleIcon size={16} />}
            size="giant"
            className={`${decision ? actionApproveButtonClassName : actionRejectButtonClassName} w-full min-w-0 sm:w-auto`}
            disabled={ReviewPersonnelAction.isPending}
            isLoading={ReviewPersonnelAction.isPending}
          />
        </div>
      </form>
    </Modal>
  );
};
