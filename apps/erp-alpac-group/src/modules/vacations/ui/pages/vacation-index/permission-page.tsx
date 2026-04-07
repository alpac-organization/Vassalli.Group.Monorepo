import { Alert, AnimatedAlertWrapper, Breadcrumb } from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type {
  PermissionHistoryRequest,
  PermissionHistoryRow,
  VacationStatusFilterValue,
  PermissionTypeFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/permission-history-request";
import type { PermissionHistoryResponse } from "@app/modules/vacations/domain/ApiContract/Responses/permission-history-response";
import { PermissionFiltersBar } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-filters-bar";
import { PermissionPageHeader } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-page-header";
import { PermissionTable } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-table";
import { VacationStatsSection } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-stats-section";
import { NewPermissionRequestModal } from "@app/modules/vacations/ui/pages/vacation-index/components/new-permission-request/new-permission-request-modal";
import { PermissionRequestDetailsModal } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-details/permission-details-modal";
import {
  usePermission,
  type UseVacationPayload,
} from "@app/modules/vacations/ui/hooks/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCollaboratorProfileDetails } from "@app/modules/payroll/ui/hooks/useCollaboratorProfile";
import {
  derivarUiModalNuevaPermission,
  derivarUiSaldoVacaciones,
} from "@app/modules/vacations/ui/pages/vacation-index/utils/permission-view-state";

export default function VacationPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber, fullName } =
    useUserStore();

  const [filterDraft, setFilterDraft] =
    useState<VacationStatusFilterValue>("all");
  const [appliedStatus, setAppliedStatus] =
    useState<VacationStatusFilterValue>("all");

  const [typeDraft, setTypeDraft] = useState<PermissionTypeFilterValue>("all");
  const [appliedType, setAppliedType] =
    useState<PermissionTypeFilterValue>("all");

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

  const historyFilters = useMemo<PermissionHistoryRequest | undefined>(() => {
    if (!companyId || !moduleCode || !identificationNumber) return undefined;
    return {
      companie_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber,
      page_size: 10,
      page_number: 1,
      ...(appliedStatus !== "all" && { status: appliedStatus }),
      ...(appliedType !== "all" && { type: appliedType }),
    };
  }, [companyId, moduleCode, identificationNumber, appliedStatus, appliedType]);

  const {
    GetVacationSaldoQuery,
    GetPermissionHistory,
    cancelPermissionRequestMutation,
  } = usePermission(vacationSaldoPayload, historyFilters);
  const { GetProfileDetails } = useCollaboratorProfileDetails({
    company_id: companyId,
    module_code: moduleCode,
    identification_number: identificationNumber,
  });

  const {
    uiSaldoVacaciones: balanceVacation,
    uiModalNuevaPermission: profileCollaborator,
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
      uiModalNuevaPermission: derivarUiModalNuevaPermission(
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
    useState<PermissionHistoryResponse | null>(null);
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

  const filteredRows = useMemo<PermissionHistoryRow[]>(() => {
    const items = GetPermissionHistory.data;
    if (!Array.isArray(items) || items.length === 0) return [];
    const collaboratorName =
      GetVacationSaldoQuery.data?.full_name?.trim() || fullName || "";
    return items.map((item) => ({
      id: item.permit_application_id,
      full_name: collaboratorName,
      type: item.type,
      start_date: item.start_date,
      end_date: item.end_date,
      start_time:
        item.type !== "Vacation" ? item.start_time || undefined : undefined,
      end_time:
        item.type !== "Vacation" ? item.end_time || undefined : undefined,
      status: item.status,
      approved_by: item.approved_by || undefined,
      rejected_by: item.rejected_by || undefined,
    }));
  }, [GetPermissionHistory.data, GetVacationSaldoQuery.data, fullName]);

  const handleApplyFilters = useCallback(() => {
    setAppliedStatus(filterDraft);
    setAppliedType(typeDraft);
  }, [filterDraft, typeDraft]);

  const handleClearFilters = useCallback(() => {
    setFilterDraft("all");
    setAppliedStatus("all");
    setTypeDraft("all");
    setAppliedType("all");
  }, []);

  const handleViewDetails = useCallback(
    (row: PermissionHistoryRow) => {
      const item = GetPermissionHistory.data?.find(
        (i) => String(i.permit_application_id) === String(row.id),
      );
      if (!item) return;
      setSelectedVacationItem(item);
      setIsDetailsOpen(true);
    },
    [GetPermissionHistory.data],
  );

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  const handleGenerateDocument = useCallback((_row: PermissionHistoryRow) => {
    // lógica de generación de documento pendiente
    console.log("generando documento");
  }, []);

  const handleCancellVacation = useCallback(
    (row: PermissionHistoryRow) => {
      if (!companyId || !moduleCode || !identificationNumber) return;
      cancelPermissionRequestMutation.mutate(
        {
          company_id: companyId,
          module_code: moduleCode,
          identification_number: identificationNumber,
          permit_application_id: Number(row.id),
        },
        {
          onSuccess: () => {
            setAlertState({
              open: true,
              type: "success",
              message: "Su solicitud ha sido cancelada exitosamente.",
            });
          },
          onError: () => {
            setAlertState({
              open: true,
              type: "error",
              message:
                "No se pudo cancelar la solicitud. Intente nuevamente.",
            });
          },
        },
      );
    },
    [
      companyId,
      moduleCode,
      identificationNumber,
      cancelPermissionRequestMutation,
    ],
  );
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

        <PermissionPageHeader
          onNewRequest={() => setIsNewRequestOpen(true)}
          collaboratorDisplayName={balanceVacation.nombreColaboradorParaMostrar}
        />

        <NewPermissionRequestModal
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

        <PermissionRequestDetailsModal
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

        <PermissionFiltersBar
          filterDraft={filterDraft}
          onFilterDraftChange={setFilterDraft}
          typeDraft={typeDraft}
          onTypeDraftChange={setTypeDraft}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        <PermissionTable
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
