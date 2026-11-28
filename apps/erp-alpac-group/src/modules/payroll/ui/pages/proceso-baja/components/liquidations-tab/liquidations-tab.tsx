import { Button, Pagination } from "@alpac/design-system";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { LiquidationDto } from "@app/modules/payroll/domain/ApiContract/Responses/liquidation-responses/get-liquidations.response";
import { useLiquidation } from "@app/modules/payroll/ui/hooks/liquidation/useLiquidation";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { LiquidationDetailModal } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidation-detail-modal/liquidation-detail-modal";
import { LiquidationsTable } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidations-table/liquidations-table";
import type { LiquidationsTabProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidations-tab/liquidations-tab.types";
import {
  PROCESO_BAJA_PAGE_SIZE,
  procesoBajaCancelButtonClassName,
  procesoBajaDangerButtonClassName,
  procesoBajaPrimaryButtonClassName,
  procesoBajaSecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useMemo, useState } from "react";

type ConfirmKind = "APPROVE" | "PAY" | "CANCEL";

type ConfirmState = {
  isOpen: boolean;
  kind: ConfirmKind;
  row: LiquidationDto | null;
};

export const LiquidationsTab = ({ mode }: LiquidationsTabProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    kind: "APPROVE",
    row: null,
  });

  const identificationNumber =
    selectedCollaborator?.personal_information?.identification_number?.trim() ?? "";

  const primaryFilters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PROCESO_BAJA_PAGE_SIZE,
      status: mode === "in-progress" ? ("Calculated" as const) : ("Approved" as const),
      ...(identificationNumber ? { identification_number: identificationNumber } : {}),
    }),
    [companyId, moduleCode, pageNumber, mode, identificationNumber],
  );

  const paidFilters = useMemo(
    () =>
      mode === "approved"
        ? {
            company_id: companyId,
            module_code: moduleCode,
            page_number: pageNumber,
            page_size: PROCESO_BAJA_PAGE_SIZE,
            status: "Paid" as const,
            ...(identificationNumber
              ? { identification_number: identificationNumber }
              : {}),
          }
        : undefined,
    [companyId, moduleCode, pageNumber, mode, identificationNumber],
  );

  const {
    GetLiquidations,
    ApproveLiquidation,
    PayLiquidation,
    CancelLiquidation,
  } = useLiquidation({ liquidationsFilters: primaryFilters });

  const { GetLiquidations: GetPaidLiquidations } = useLiquidation({
    liquidationsFilters: paidFilters,
  });

  const rows = useMemo(() => {
    const primary = GetLiquidations.data?.data ?? [];
    if (mode !== "approved") return primary;
    const paid = GetPaidLiquidations.data?.data ?? [];
    return [...primary, ...paid];
  }, [GetLiquidations.data?.data, GetPaidLiquidations.data?.data, mode]);

  const total =
    mode === "approved"
      ? (GetLiquidations.data?.total ?? 0) + (GetPaidLiquidations.data?.total ?? 0)
      : (GetLiquidations.data?.total ?? 0);

  const openConfirm = useCallback((kind: ConfirmKind, row: LiquidationDto) => {
    setConfirmState({ isOpen: true, kind, row });
  }, []);

  const handleConfirm = useCallback(
    async (_type: ConfirmActionType, observation?: string) => {
      try {
        if (confirmState.kind === "APPROVE" && confirmState.row) {
          await ApproveLiquidation.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            liquidation_id: confirmState.row.liquidation_id,
          });
          handleRequestSuccess("Liquidación aprobada.");
        } else if (confirmState.kind === "PAY" && confirmState.row) {
          await PayLiquidation.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            liquidation_id: confirmState.row.liquidation_id,
          });
          handleRequestSuccess("Liquidación pagada.");
        } else if (confirmState.kind === "CANCEL" && confirmState.row) {
          const reason = observation?.trim();
          if (!reason) {
            handleRequestError("Debe indicar el motivo de cancelación.");
            return;
          }
          await CancelLiquidation.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            liquidation_id: confirmState.row.liquidation_id,
            cancellation_reason: reason,
          });
          handleRequestSuccess("Liquidación cancelada.");
        }

        setConfirmState({ isOpen: false, kind: "APPROVE", row: null });
      } catch (error) {
        const mapped = getMappedError(error as ApiErrorResponse);
        handleRequestError(mapped.description || "No se pudo completar la acción.");
      }
    },
    [
      ApproveLiquidation,
      CancelLiquidation,
      PayLiquidation,
      companyId,
      confirmState.kind,
      confirmState.row,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
      moduleCode,
    ],
  );

  const confirmCopy = useMemo(() => {
    switch (confirmState.kind) {
      case "APPROVE":
        return {
          title: "¿Aprobar esta liquidación?",
          actionLabel: "Aprobar",
          actionClass: procesoBajaPrimaryButtonClassName,
          needsObservation: false,
        };
      case "PAY":
        return {
          title: "¿Pagar esta liquidación?",
          actionLabel: "Pagar",
          actionClass: procesoBajaPrimaryButtonClassName,
          needsObservation: false,
        };
      default:
        return {
          title: "¿Cancelar esta liquidación?",
          actionLabel: "Cancelar liquidación",
          actionClass: procesoBajaDangerButtonClassName,
          needsObservation: true,
        };
    }
  }, [confirmState.kind]);

  const isBusy =
    ApproveLiquidation.isPending ||
    PayLiquidation.isPending ||
    CancelLiquidation.isPending;

  const isLoading =
    GetLiquidations.isLoading || (mode === "approved" && GetPaidLiquidations.isLoading);

  return (
    <div className="flex flex-col gap-4">
      {AlertComponent}

      {mode === "approved" && (
        <div className="w-full md:max-w-md">
          <CollaboratorSearchForm
            label="Buscar colaborador"
            onSuccess={(collaborator) => {
              setSelectedCollaborator(collaborator);
              setPageNumber(1);
            }}
          />
          {selectedCollaborator && (
            <Button
              size="giant"
              label="Limpiar búsqueda"
              className={`${procesoBajaSecondaryButtonClassName} mt-2! w-full min-w-0 sm:w-auto`}
              onClick={() => {
                setSelectedCollaborator(null);
                setPageNumber(1);
              }}
            />
          )}
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <LiquidationsTable
          data={rows}
          mode={mode}
          onViewDetail={(row) => setDetailId(row.liquidation_id)}
          onApprove={
            mode === "in-progress" ? (row) => openConfirm("APPROVE", row) : undefined
          }
          onPay={mode === "approved" ? (row) => openConfirm("PAY", row) : undefined}
          onCancel={
            mode === "in-progress" ? (row) => openConfirm("CANCEL", row) : undefined
          }
          pagination={
            <Pagination
              currentPage={pageNumber}
              pageSize={PROCESO_BAJA_PAGE_SIZE}
              totalRecords={total}
              onPageChange={setPageNumber}
              disabled={GetLiquidations.isFetching}
            />
          }
        />
      )}

      <LiquidationDetailModal
        isOpen={Boolean(detailId)}
        liquidationId={detailId}
        onClose={() => setDetailId(null)}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        type={confirmState.kind === "CANCEL" ? "CANCEL" : "APPROVE"}
        variant="warning"
        title={confirmCopy.title}
        buttonActionLabel={confirmCopy.actionLabel}
        buttonActionClass={confirmCopy.actionClass}
        buttonCancelClass={procesoBajaCancelButtonClassName}
        hasObservation={confirmCopy.needsObservation}
        observationLabel="motivo de cancelación"
        isObservationRequired={confirmCopy.needsObservation}
        isLoading={isBusy}
        disabled={isBusy}
        onClose={() => setConfirmState({ isOpen: false, kind: "APPROVE", row: null })}
        handleFinalAction={handleConfirm}
      />
    </div>
  );
};
