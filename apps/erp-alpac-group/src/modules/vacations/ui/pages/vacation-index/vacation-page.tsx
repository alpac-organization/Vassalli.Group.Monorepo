import { Alert, AnimatedAlertWrapper, Breadcrumb } from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type {
  VacationHistoryRequest,
  VacationRequestRow,
  VacationStatusFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
import { VacationFiltersBar } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-filters-bar";
import { VacationPageHeader } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-page-header";
import { VacationRequestsTable } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-requests-table";
import { VacationStatsSection } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-stats-section";
import { NewVacationRequestModal } from "@app/modules/vacations/ui/pages/vacation-index/components/new-vacation-request/new-vacation-request-modal";
import { VacationRequestDetailsModal } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-request-details/vacation-request-details-modal";
import type { VacationHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-history-response";
import {
  useVacation,
  type UseVacationPayload,
} from "@app/modules/vacations/ui/hooks/useVacations";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCollaboratorProfileDetails } from "@app/modules/payroll/ui/hooks/useCollaboratorProfile";
import {
  derivarUiModalNuevaVacacion,
  derivarUiSaldoVacaciones,
} from "@app/modules/vacations/ui/pages/vacation-index/utils/vacation-view-state";

export default function VacationPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber, fullName } =
    useUserStore();

  const [filterDraft, setFilterDraft] =
    useState<VacationStatusFilterValue>("all");
  const [appliedStatus, setAppliedStatus] =
    useState<VacationStatusFilterValue>("all");

  // se obtiene aqui los datos necesarios para consultar el saldo de vacaciones del colaborador actual,
  const vacationSaldoPayload = useMemo<UseVacationPayload | undefined>(() => {
    if (!companyId || !moduleCode || !identificationNumber) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber,
    };
  }, [companyId, moduleCode, identificationNumber]);

  const saldoContextReady = Boolean(vacationSaldoPayload);

  const historyFilters = useMemo<VacationHistoryRequest | undefined>(() => {
    if (!companyId || !moduleCode || !identificationNumber) return undefined;
    return {
      companie_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber,
      page_size: 10,
      page_number: 1,
      ...(appliedStatus !== "all" && { status: appliedStatus }),
    };
  }, [companyId, moduleCode, identificationNumber, appliedStatus]);

  const { GetVacationSaldoQuery, GetVacationHistory } = useVacation(
    vacationSaldoPayload,
    historyFilters,
  );
  const { GetProfileDetails } = useCollaboratorProfileDetails({
    company_id: companyId,
    module_code: moduleCode,
    identification_number: identificationNumber,
  });

  const {
    uiSaldoVacaciones: balanceVacation,
    uiModalNuevaVacacion: profileCollaborator,
  } = useMemo(() => {
    const querySaldoVacation = {
      isLoading: GetVacationSaldoQuery.isPending,
      isError: GetVacationSaldoQuery.isError,
      datos: GetVacationSaldoQuery.data,
    };
    const queryPerfilVacation = {
      isLoading: GetProfileDetails.isPending,
      datos: GetProfileDetails.data,
    };
    // Retorna el estado listo para usar en la UI para las secciones de saldo de vacaciones
    // y detalles del colaborador en el modal de nueva solicitud, como nombre y puesto de trabajo.
    return {
      uiSaldoVacaciones: derivarUiSaldoVacaciones(
        saldoContextReady,
        querySaldoVacation,
      ),
      uiModalNuevaVacacion: derivarUiModalNuevaVacacion(
        saldoContextReady,
        querySaldoVacation,
        queryPerfilVacation,
        fullName,
      ),
    };
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data,
    GetProfileDetails.isPending,
    GetProfileDetails.data,
    fullName,
  ]);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  const [selectedVacationItem, setSelectedVacationItem] =
    useState<VacationHistoryResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [alertState, setAlertState] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({ open: false, type: "success", message: "" });

  useEffect(() => {
    if (!alertState.open) return;
    const timer = window.setTimeout(
      () => setAlertState((prev) => ({ ...prev, open: false })),
      5000,
    );
    return () => window.clearTimeout(timer);
  }, [alertState.open]);

  const handleRequestSuccess = useCallback(() => {
    setAlertState({
      open: true,
      type: "success",
      message: "Solicitud de vacaciones enviada exitosamente.",
    });
  }, []);

  const handleRequestError = useCallback((description: string) => {
    setAlertState({ open: true, type: "error", message: description });
  }, []);

  const filteredRows = useMemo<VacationRequestRow[]>(() => {
    const items = GetVacationHistory.data;
    if (!Array.isArray(items) || items.length === 0) return [];
    const collaboratorName =
      GetVacationSaldoQuery.data?.full_name?.trim() || fullName || "";
    return items.map((item) => ({
      id: item.vacation_request_id,
      full_name: collaboratorName,
      start_date: item.start_date,
      end_date: item.end_date,
      status: item.status,
      approved_by: item.approved_by || undefined,
      rejected_by: item.rejected_by || undefined,
    }));
  }, [GetVacationHistory.data, GetVacationSaldoQuery.data, fullName]);

  const handleApplyFilters = useCallback(() => {
    setAppliedStatus(filterDraft);
  }, [filterDraft]);

  const handleClearFilters = useCallback(() => {
    setFilterDraft("all");
    setAppliedStatus("all");
  }, []);

  const handleViewDetails = useCallback(
    (row: VacationRequestRow) => {
      const item = GetVacationHistory.data?.find(
        (i) => i.vacation_request_id === row.id,
      );
      if (!item) return;
      setSelectedVacationItem(item);
      setIsDetailsOpen(true);
    },
    [GetVacationHistory.data],
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const handleGenerateDocument = useCallback((_row: VacationRequestRow) => {
    // lógica de generación de documento pendiente
    console.log("generando documento");
  }, []);

  const handleCancellVacation = useCallback((_row: VacationRequestRow) => {
    console.log("cancelando documento");
    // lógica de generación de documento pendiente
  }, []);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                url: "/",
                onClick: (url) => navigate(url),
              },
              {
                label: "Gestión de permisos",
                url: "/work-management/gestion-vacations",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <VacationPageHeader
          onNewRequest={() => setIsNewRequestOpen(true)}
          collaboratorDisplayName={balanceVacation.nombreColaboradorParaMostrar}
        />

        <NewVacationRequestModal
          isOpen={isNewRequestOpen}
          onClose={() => setIsNewRequestOpen(false)}
          collaboratorFullName={profileCollaborator.nombreCompletoColaborador}
          collaboratorWorkPosition={
            profileCollaborator.puestoDeTrabajoColaborador
          }
          isCollaboratorFullNameLoading={
            profileCollaborator.nombreColaboradorCargando
          }
          isCollaboratorWorkPositionLoading={
            profileCollaborator.puestoColaboradorCargando
          }
          onRequestSuccess={handleRequestSuccess}
          onRequestError={handleRequestError}
        />

        <VacationRequestDetailsModal
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          item={selectedVacationItem}
          collaboratorFullName={profileCollaborator.nombreCompletoColaborador}
        />

        <VacationStatsSection
          daysTakenDisplay={balanceVacation.mostrarDiasDisfrutados}
          daysRemainingDisplay={balanceVacation.mostrarDiasDisponibles}
          daysGeneratedDisplay={balanceVacation.mostrarDiasGenerados}
        />

        <VacationFiltersBar
          filterDraft={filterDraft}
          onFilterDraftChange={setFilterDraft}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <VacationRequestsTable
          data={filteredRows}
          onViewDetails={handleViewDetails}
          onGenerateDocument={handleGenerateDocument}
          onCancelRequest={handleCancellVacation}
        />
      </motion.div>

      <AnimatedAlertWrapper open={alertState.open}>
        <Alert
          type={alertState.type}
          title={alertState.type === "success" ? "Éxito" : "Error"}
          message={alertState.message}
          showCloseButton
          onClose={() => setAlertState((prev) => ({ ...prev, open: false }))}
        />
      </AnimatedAlertWrapper>
    </>
  );
}
