import { Button, DatePicker, Pagination } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { TerminationDto } from "@app/modules/payroll/domain/ApiContract/Responses/termination-responses/get-terminations.response";
import { toDateOnly, toDayjsValue } from "@app/shared/utils/date.utils";
import {
  useLiquidation,
  useTerminationsWithoutActiveLiquidation,
} from "@app/modules/payroll/ui/hooks/liquidation/useLiquidation";
import { useTermination } from "@app/modules/payroll/ui/hooks/termination/useTermination";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { RegisterTerminationModal } from "@app/modules/payroll/ui/pages/proceso-baja/components/register-termination-modal/register-termination-modal";
import { TerminationDetailModal } from "@app/modules/payroll/ui/pages/proceso-baja/components/termination-detail-modal/termination-detail-modal";
import { TerminationsTable } from "@app/modules/payroll/ui/pages/proceso-baja/components/terminations-table/terminations-table";
import type { TerminationsTabProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/terminations-tab/terminations-tab.types";
import {
  formatEffectiveDeparture,
  getCloseDateHint,
  getCloseDepartureError,
  toEffectiveDepartureValue,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.date-rules";
import {
  PROCESO_BAJA_PAGE_SIZE,
  procesoBajaCancelButtonClassName,
  procesoBajaDangerButtonClassName,
  procesoBajaDropdownClassName,
  procesoBajaLabelClassName,
  procesoBajaPrimaryButtonClassName,
  procesoBajaSecondaryButtonClassName,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import { getTerminationTypeLabel } from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.labels";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import type { ConfirmActionType } from "@app/shared/components/confirm-modal/confirm-modal.types";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useMemo, useState } from "react";

type ConfirmState = {
  isOpen: boolean;
  type: ConfirmActionType;
  row: TerminationDto | null;
};

export const TerminationsTab = ({ mode }: TerminationsTabProps) => {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestSuccess, handleRequestError } = useAlertState();

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [closeAttempted, setCloseAttempted] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    type: "APPROVE",
    row: null,
  });
  const [liquidationRow, setLiquidationRow] = useState<TerminationDto | null>(null);

  const identificationNumber =
    selectedCollaborator?.personal_information?.identification_number?.trim() ?? "";

  const filters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PROCESO_BAJA_PAGE_SIZE,
      termination_status: mode === "pending" ? ("Pending" as const) : ("Closed" as const),
      ...(identificationNumber ? { identification_number: identificationNumber } : {}),
    }),
    [companyId, moduleCode, pageNumber, mode, identificationNumber],
  );

  const { GetTerminations, CloseTermination, CancelTermination } = useTermination({
    terminationsFilters: filters,
  });
  const { CalculateLiquidation } = useLiquidation();

  const rows = useMemo(() => GetTerminations.data?.data ?? [], [GetTerminations.data?.data]);
  const total = GetTerminations.data?.total ?? 0;
  const terminationIds = useMemo(
    () => (mode === "closed" ? rows.map((row) => row.termination_id) : []),
    [mode, rows],
  );
  const calculableTerminationIds = useTerminationsWithoutActiveLiquidation(
    terminationIds,
    companyId,
    moduleCode,
    mode === "closed",
  );

  const openCloseConfirm = useCallback((row: TerminationDto) => {
    setDepartureDate("");
    setCloseAttempted(false);
    setConfirmState({ isOpen: true, type: "APPROVE", row });
  }, []);

  const openCancelConfirm = useCallback((row: TerminationDto) => {
    setConfirmState({ isOpen: true, type: "CANCEL", row });
  }, []);

  const openCalculateLiquidation = useCallback((row: TerminationDto) => {
    setLiquidationRow(row);
  }, []);

  const closeLiquidationAction = useCallback(() => {
    setLiquidationRow(null);
  }, []);

  const handleConfirm = useCallback(
    async (_type: ConfirmActionType, observation?: string) => {
      const row = confirmState.row;
      if (!row) return;

      try {
        if (confirmState.type === "APPROVE") {
          setCloseAttempted(true);
          const scheduledDeparture = toEffectiveDepartureValue(
            row.notice_date,
            row.notice_days,
          );
          const dateError = getCloseDepartureError(
            row.notice_date,
            row.notice_days,
            departureDate,
          );
          if (dateError) {
            handleRequestError(dateError);
            return;
          }
          await CloseTermination.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            termination_id: row.termination_id,
            departure_date: scheduledDeparture ?? departureDate,
          });
          handleRequestSuccess("La baja se cerró correctamente.");
        } else {
          const reason = observation?.trim();
          if (!reason) {
            handleRequestError("Debe indicar el motivo de cancelación.");
            return;
          }
          await CancelTermination.mutateAsync({
            company_id: companyId,
            module_code: moduleCode,
            termination_id: row.termination_id,
            cancellation_reason: reason,
          });
          handleRequestSuccess("La baja se canceló correctamente.");
        }
        setConfirmState({ isOpen: false, type: "CANCEL", row: null });
      } catch (error) {
        const mapped = getMappedError(error as ApiErrorResponse);
        handleRequestError(mapped.description || "No se pudo completar la acción.");
      }
    },
    [
      CancelTermination,
      CloseTermination,
      companyId,
      confirmState.row,
      confirmState.type,
      departureDate,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
      moduleCode,
    ],
  );

  const handleLiquidationAction = useCallback(
    async () => {
      if (!liquidationRow) return;

      try {
        await CalculateLiquidation.mutateAsync({
          company_id: companyId,
          module_code: moduleCode,
          termination_id: liquidationRow.termination_id,
        });
        handleRequestSuccess("Liquidación calculada correctamente.");
        setLiquidationRow(null);
      } catch (error) {
        const mapped = getMappedError(error as ApiErrorResponse);
        handleRequestError(mapped.description || "No se pudo calcular la liquidación.");
      }
    },
    [
      CalculateLiquidation,
      companyId,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
      liquidationRow,
      moduleCode,
    ],
  );

  const isPendingAction = CloseTermination.isPending || CancelTermination.isPending;
  const isLiquidationBusy = CalculateLiquidation.isPending;
  const isCloseConfirm = confirmState.type === "APPROVE";
  const closeRow = isCloseConfirm ? confirmState.row : null;
  const scheduledDeparture = closeRow
    ? toEffectiveDepartureValue(closeRow.notice_date, closeRow.notice_days)
    : null;
  const scheduledDepartureLabel = scheduledDeparture
    ? formatEffectiveDeparture(closeRow?.notice_date, closeRow?.notice_days)
    : null;
  const departureError = closeRow
    ? getCloseDepartureError(closeRow.notice_date, closeRow.notice_days, departureDate)
    : null;
  const closeBlocked = Boolean(isCloseConfirm && departureError);

  return (
    <div className="flex flex-col gap-4">
      {AlertComponent}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
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

        {mode === "pending" && (
          <Button
            size="giant"
            label="Registrar baja"
            className={`${procesoBajaPrimaryButtonClassName} w-full min-w-0 sm:w-auto`}
            onClick={() => setIsRegisterOpen(true)}
          />
        )}
      </div>

      {GetTerminations.isLoading ? (
        <Loader />
      ) : (
        <TerminationsTable
          data={rows}
          mode={mode}
          onViewDetail={(row) => setDetailId(row.termination_id)}
          onClose={mode === "pending" ? openCloseConfirm : undefined}
          onCancel={mode === "pending" ? openCancelConfirm : undefined}
          onCalculateLiquidation={mode === "closed" ? openCalculateLiquidation : undefined}
          canCalculateLiquidation={
            mode === "closed"
              ? (row) => calculableTerminationIds.has(row.termination_id)
              : undefined
          }
          pagination={
            <Pagination
              currentPage={pageNumber}
              pageSize={PROCESO_BAJA_PAGE_SIZE}
              totalRecords={total}
              onPageChange={setPageNumber}
              disabled={GetTerminations.isFetching}
            />
          }
        />
      )}

      <TerminationDetailModal
        isOpen={Boolean(detailId)}
        terminationId={detailId}
        onClose={() => setDetailId(null)}
      />

      <RegisterTerminationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRequestSuccess}
        onError={handleRequestError}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        type={confirmState.type}
        variant="warning"
        title={
          isCloseConfirm
            ? "¿Cerrar esta baja de colaborador?"
            : "¿Cancelar esta baja de colaborador?"
        }
        buttonActionLabel={isCloseConfirm ? "Cerrar baja" : "Cancelar baja"}
        buttonActionClass={
          isCloseConfirm
            ? procesoBajaPrimaryButtonClassName
            : procesoBajaDangerButtonClassName
        }
        buttonCancelClass={procesoBajaCancelButtonClassName}
        hasObservation={!isCloseConfirm}
        observationLabel="motivo de cancelación"
        isObservationRequired={!isCloseConfirm}
        isLoading={isPendingAction}
        disabled={isPendingAction}
        actionDisabled={closeBlocked}
        onClose={() => setConfirmState({ isOpen: false, type: "CANCEL", row: null })}
        handleFinalAction={handleConfirm}
      >
        {isCloseConfirm && closeRow && (
          <div className="flex flex-col gap-2">
            <p className="m-0 text-sm text-slate-500 dark:text-slate-300">
              Tipo: {getTerminationTypeLabel(closeRow.termination_type)}
            </p>
            {scheduledDepartureLabel ? (
              <p className="m-0 text-sm text-slate-500 dark:text-slate-300">
                Fecha efectiva de egreso: {scheduledDepartureLabel}. Se calcula con
                el preaviso y los días registrados.{" "}
                {closeBlocked
                  ? "Quedó definida al registrar el preaviso. El cierre no se puede hacer antes de ese día. Para cerrarla hoy, anule este expediente y regístrelo sin preaviso, o con 0 días."
                  : "Ya puede cerrarla. También puede hacerlo cualquier día después."}
              </p>
            ) : (
              <DatePicker
                label="Fecha efectiva de egreso"
                labelAbove
                fieldWidth="large"
                isRequired
                disableFuture
                className={procesoBajaDropdownClassName}
                labelClassName={procesoBajaLabelClassName}
                value={toDayjsValue(departureDate)}
                onChange={(value) => setDepartureDate(toDateOnly(value))}
                error={
                  departureDate && closeAttempted ? (departureError ?? undefined) : undefined
                }
                slotProps={{
                  popper: {
                    disablePortal: false,
                    sx: { zIndex: 2000 },
                  },
                }}
              />
            )}
            {!scheduledDepartureLabel && (
              <p className="m-0 text-sm text-slate-500 dark:text-slate-300">
                {getCloseDateHint(closeRow.termination_type)} Puede ser hoy o
                cualquier día anterior. Una fecha futura se rechaza.
              </p>
            )}
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        isOpen={Boolean(liquidationRow)}
        type="APPROVE"
        variant="warning"
        title="¿Calcular la liquidación de esta baja?"
        buttonActionLabel="Calcular"
        buttonActionClass={procesoBajaPrimaryButtonClassName}
        buttonCancelClass={procesoBajaCancelButtonClassName}
        isLoading={isLiquidationBusy}
        disabled={isLiquidationBusy}
        onClose={closeLiquidationAction}
        handleFinalAction={handleLiquidationAction}
      >
        {liquidationRow && (
          <p className="m-0 text-sm text-slate-500 dark:text-slate-300">
            {liquidationRow.collaborator_name?.trim() || "Colaborador"}. El cálculo usa
            la baja cerrada y la fecha de egreso.
          </p>
        )}
      </ConfirmModal>
    </div>
  );
};
