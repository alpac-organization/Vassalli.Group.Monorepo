import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { ApplyPersonnelActionRequest } from "@app/modules/payroll/domain/ApiContract/Requests/personnel-action-requests/apply-personnel-action.request";
import { usePersonnelAction } from "@app/modules/payroll/ui/hooks/personnel-action/usePersonnelAction";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import { AlertTriangleIcon } from "lucide-react";
import {
  actionApproveButtonClassName,
  actionCancelOutlineClassName,
} from "../../utils/personnel-actions.constants";
import type { ApplyPersonnelActionModalProps } from "./apply-personnel-action-modal.types";

export const ApplyPersonnelActionModal = ({
  isOpen,
  onClose,
  onSuccess,
  request,
}: ApplyPersonnelActionModalProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestError } = useAlertState();

  const { ApplyPersonnelAction } = usePersonnelAction();

  const handleApply = async () => {
    if (!request) return;

    const payload: ApplyPersonnelActionRequest = {
      company_id: companyId,
      module_code: moduleCode,
      request_id: request.id,
    };

    try {
      await ApplyPersonnelAction.mutateAsync(payload);
      onSuccess?.(
        "Acción de personal aplicada formalmente. Los memorándums fueron generados exitosamente.",
      );
      onClose();
    } catch (err) {
      const mapped = getMappedError(err as ApiErrorResponse);
      handleRequestError(mapped.description || "Error al aplicar la acción de personal");
    }
  };

  return (
    <>
      {AlertComponent}
      <ConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        variant="warning"
        type="APPROVE"
        title={`¿Aplicar acción de personal ${request?.request_code ?? ""}?`}
        buttonActionLabel="Confirmar y Aplicar"
        buttonActionClass={actionApproveButtonClassName}
        buttonCancelClass={actionCancelOutlineClassName}
        isLoading={ApplyPersonnelAction.isPending}
        disabled={ApplyPersonnelAction.isPending}
        handleFinalAction={() => {
          void handleApply();
        }}
      >
        {request && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#363a45]/40 border border-slate-200 dark:border-neutral-700 text-xs flex flex-col gap-1.5">
              <span className="font-semibold text-slate-800 dark:text-white">
                Fecha de vigencia:{" "}
                {formatDateToSpanishWords(request.effective_date?.slice(0, 10)) || "—"}
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Colaboradores a procesar: {request.total_collaborators}
                {request.area_name ? ` — Área: ${request.area_name}` : ""}
              </span>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-200">
              <AlertTriangleIcon
                size={20}
                className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400"
              />
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Efectos inmediatos de esta operación:</span>
                <ul className="list-disc list-inside space-y-0.5 text-amber-700 dark:text-amber-300">
                  <li>Se dará por concluido el salario y puesto anterior del colaborador.</li>
                  <li>Se activará el nuevo salario mensual y/o cargo en nómina.</li>
                  <li>
                    Se generarán automáticamente los memorándums institucionales en PDF (alojados
                    en S3).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </ConfirmModal>
    </>
  );
};
