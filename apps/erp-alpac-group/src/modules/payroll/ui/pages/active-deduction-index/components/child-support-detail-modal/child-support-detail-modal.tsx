import { Modal, RadioButton } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useState } from "react";
import {
  deductionCancelOutlineClassName,
  deductionLabelClassName,
  deductionModalContentClassName,
  deductionModalPanelClassName,
  deductionRejectButtonClassName,
} from "../../utils/active-deduction.constants";
import { ChildSupportDetailContent } from "./child-support-detail-content";
import type { ChildSupportDetailModalProps } from "./child-support-detail-modal.types";

type CeaseTargetStatus = 2 | 4;

export function ChildSupportDetailModal({
  isOpen,
  onClose,
  summary,
  detail,
  isLoading,
  isError,
  onActionSuccess,
  onActionError,
}: ChildSupportDetailModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { UpdateDeduction } = useDeduction();
  const { getMappedError } = useMappedError();

  const [ceaseModalOpen, setCeaseModalOpen] = useState(false);
  const [ceaseStatus, setCeaseStatus] = useState<CeaseTargetStatus>(2);

  const handleRequestCease = useCallback(() => {
    setCeaseStatus(2);
    setCeaseModalOpen(true);
  }, []);

  const handleConfirmCease = useCallback(() => {
    if (!summary?.deduction_id) return;

    UpdateDeduction.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        deduction_id: summary.deduction_id,
        status: ceaseStatus,
      },
      {
        onSuccess: () => {
          setCeaseModalOpen(false);
          onActionSuccess?.("Embargo alimenticio cesado correctamente", true);
        },
        onError: (err: ApiErrorResponse) => {
          const mapped = getMappedError(err);
          onActionError?.(
            mapped.description || "No se pudo cesar el embargo alimenticio",
          );
        },
      },
    );
  }, [
    summary,
    companyId,
    moduleCode,
    ceaseStatus,
    UpdateDeduction,
    onActionSuccess,
    onActionError,
    getMappedError,
  ]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        variant="default"
        size="4xl"
        title="Detalles del Embargo Alimenticio"
        panelClassName={deductionModalPanelClassName}
        contentClassName={deductionModalContentClassName}
      >
        <ChildSupportDetailContent
          key={`${summary?.deduction_id ?? "none"}-${isOpen}`}
          summary={summary}
          detail={detail}
          isLoading={isLoading}
          isError={isError}
          onRequestCease={handleRequestCease}
          onActionSuccess={onActionSuccess}
          onActionError={onActionError}
        />
      </Modal>

      <ConfirmModal
        isOpen={ceaseModalOpen}
        type="CANCEL"
        title={`¿Desea cesar el embargo alimenticio de ${summary?.collaborato_fullname?.trim() || "este colaborador"}?`}
        buttonActionLabel="Confirmar cese"
        buttonActionClass={deductionRejectButtonClassName}
        buttonCancelClass={deductionCancelOutlineClassName}
        isLoading={UpdateDeduction.isPending}
        onClose={() => !UpdateDeduction.isPending && setCeaseModalOpen(false)}
        handleFinalAction={handleConfirmCease}
      >
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3 dark:border-neutral-700 dark:bg-[#1e2229]">
          <p className="m-0 text-xs text-slate-600 dark:text-slate-300">
            Seleccione el estado de cierre. Se recalculará automáticamente cualquier nómina abierta.
          </p>
          <div className="flex flex-col gap-2">
            <RadioButton
              id="cease-status-completed"
              name="cease-status"
              value="2"
              label="Finalizar (Completado)"
              labelPosition="right"
              labelClassName={deductionLabelClassName}
              checked={ceaseStatus === 2}
              onChange={() => setCeaseStatus(2)}
            />
            <RadioButton
              id="cease-status-canceled"
              name="cease-status"
              value="4"
              label="Cancelar Embargo"
              labelPosition="right"
              labelClassName={deductionLabelClassName}
              checked={ceaseStatus === 4}
              onChange={() => setCeaseStatus(4)}
            />
          </div>
        </div>
      </ConfirmModal>
    </>
  );
}
