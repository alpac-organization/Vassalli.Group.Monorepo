import {
  Alert,
  AnimatedAlertWrapper,
  Banner,
  Breadcrumb,
  Button,
} from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { m, LazyMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type {
  PermissionRequest,
  PermissionHistoryRow,
  VacationStatusFilterValue,
  PermissionTypeFilterValue,
} from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-request";
import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import { PermissionFiltersBar } from "@app/modules/payroll/ui/pages/permissions/components/permission-filters-bar/permission-filters-bar";
import { PermissionPageHeader } from "@app/modules/payroll/ui/pages/permissions/components/permission-page-header/permission-page-header";
import { PermissionTable } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/permission-table";
import { VacationStatsSection } from "@app/modules/payroll/ui/pages/permissions/components/vacation-stats-section";
import { NewPermissionRequestModal } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/new-permission-modal";
import { PermissionRequestDetailsModal } from "@app/modules/payroll/ui/pages/permissions/components/permission-details/permission-details-modal";
import {
  usePermission,
  type UseVacationPayload,
} from "@app/modules/payroll/ui/hooks/permission/usePermission";
import { utilsPermissionPageInitialLoader } from "@app/modules/payroll/ui/pages/permissions/utils/utilsPermissionPageInitialLoader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { useVacation } from "@app/modules/payroll/ui/hooks/vacation/useVacation";
import {
  derivarUiModalNuevaPermission,
  derivarUiSaldoVacaciones,
} from "@app/modules/payroll/ui/pages/permissions/utils/permission-view-state";
import { Loader } from "@app/shared/components/loaders/loader";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export default function PermissionsPage() {
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

  // aqui se obtiene aqui los datos necesarios para consultar el saldo de vacaciones del colaborador actual,
  const vacationSaldoPayload = useMemo<UseVacationPayload | undefined>(() => {
    if (!companyId || !moduleCode || !identificationNumber) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber,
    };
  }, [companyId, moduleCode, identificationNumber]);

  const saldoContextReady = Boolean(vacationSaldoPayload);

  const historyFilters = useMemo<PermissionRequest | undefined>(() => {
    if (!companyId || !moduleCode) return undefined;
    return {
      companie_id: companyId,
      module_code: moduleCode,
      // identification_number: identificationNumber,
      page_size: 10,
      page_number: 1,
      ...(appliedStatus !== "all" && { status: appliedStatus }),
      ...(appliedType !== "all" && { type: appliedType }),
    };
  }, [companyId, moduleCode, identificationNumber, appliedStatus, appliedType]);

  const {
    GetPermissionHistory,
    cancelPermissionRequestMutation,
    //  generatePermissionDocumentMutation,
  } = usePermission(historyFilters);
  const { GetProfileDetails } = useCollaborators({
    CollaboratorDetailsPayload: {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber ?? "",
    },
  });
  const { GetVacationSaldoQuery } = useVacation(vacationSaldoPayload);
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
    // aqui se Retorna el estado listo para usar en la UI para las secciones de saldo de vacaciones
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
    useState<PermissionResponse | null>(null);
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
      message: "Solicitud enviada exitosamente.",
    });
  }, []);

  const handleRequestError = useCallback((description: string) => {
    setAlertState({ open: true, type: "error", message: description });
    handleCloseAlert();
  }, []);

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setAlertState({ open: false, type: "success", message: "" });
    }, 3000);
  }, []);

  const filteredRows = useMemo<PermissionHistoryRow[]>(() => {
    const items = GetPermissionHistory.data;
    if (!Array.isArray(items) || items.length === 0) return [];
    const collaboratorName =
      GetVacationSaldoQuery.data?.full_name?.trim() || fullName || "";
    return items.map((item) => ({
      id: item.permit_apllication_id,
      full_name: collaboratorName,
      type: item.type,
      start_date: item.start_date,
      end_date: item.end_date,
      /* start_time: item.type !== "Vacation" ? item.start_time || null : null,
            end_time: item.type !== "Vacation" ? item.end_time || null : null, */
      start_time: item.start_time || null,
      end_time: item.end_time || null,
      status: item.status,
      // approved_by: item.approved_by || undefined,
      // rejected_by: item.rejected_by || undefined,
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
        (i) => String(i.permit_apllication_id) === String(row.id),
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

  //   const handleGenerateDocument = useCallback((_row: PermissionHistoryRow) => {
  //     if (!companyId || !moduleCode) return;
  //     generatePermissionDocumentMutation.mutate(
  //       {
  //         company_id: companyId,
  //         module_code: moduleCode,
  //         permit_application_id: _row.id,
  //       },
  //       {
  //         onSuccess: () => {
  //           console.log("Documento generado exitosamente.");
  //           // window.open(
  //           //   generatePermissionDocumentMutation.data?.document_url,
  //           //   "_blank",
  //           // );
  //           setAlertState({
  //             open: true,
  //             type: "success",
  //             message: "Documento generado exitosamente.",
  //           });
  //         },
  //         onError: () => {
  //           setAlertState({
  //             open: true,
  //             type: "error",
  //             message: "No se pudo generar el documento. Intente nuevamente.",
  //           });
  //         },
  //       },
  //     );
  //   }, []);

  const handleCancellVacation = useCallback(
    (row: PermissionHistoryRow) => {
      if (!companyId || !moduleCode) return;
      cancelPermissionRequestMutation.mutate(
        {
          company_id: companyId,
          module_code: moduleCode,
          permit_application_id: row.id,
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
              message: "No se pudo cancelar la solicitud. Intente nuevamente.",
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

  const showInitialPageLoader = utilsPermissionPageInitialLoader({
    contextReady: saldoContextReady,
    isSaldoPending: GetVacationSaldoQuery.isPending,
    isProfilePending: GetProfileDetails.isPending,
    isHistoryPending: GetPermissionHistory.isPending,
  });

  const loadError = GetVacationSaldoQuery.isError
    ? GetVacationSaldoQuery.error
    : GetProfileDetails.isError
      ? GetProfileDetails.error
      : GetPermissionHistory.isError
        ? GetPermissionHistory.error
        : undefined;

  const isLoadError =
    GetVacationSaldoQuery.isError ||
    GetProfileDetails.isError ||
    GetPermissionHistory.isError;

  if (!identificationNumber?.trim()) {
    return (
      <Banner
        variant="warning"
        title="Número de identificación no proporcionado"
        description="No se ha proporcionado un número de identificación para consultar tus permisos. Por favor, regresa al panel de inicio y selecciona un colaborador o vuelve a iniciar sesión."
      />
    );
  }

  if (!companyId?.trim() || !moduleCode?.trim()) {
    return (
      <Banner
        variant="error"
        title="Información de contexto insuficiente"
        description="No se ha proporcionado la información de contexto necesaria (ID de empresa o código de módulo) para cargar la gestión de permisos. Por favor, regresa al panel de inicio e inténtalo de nuevo."
      />
    );
  }

  if (showInitialPageLoader) {
    return <Loader title="Cargando gestión de permisos..." />;
  }

  if (isLoadError && loadError !== undefined) {
    return (
      <Banner
        variant="error"
        title="Error al cargar la gestión de permisos"
        description={getErrorMessage(loadError)}
      />
    );
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
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

        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones Directas</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Acciones rápidas para gestionar tus permisos
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
            <Button
              size="giant"
              label="Nueva Solicitud"
              icon={<CalendarPlus size={20} />}
              className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
              onClick={() => setIsNewRequestOpen(true)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Filtros</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Descripcion de filtros
            </small>
          </div>
        </div>

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
          //  onGenerateDocument={handleGenerateDocument}
          onCancelRequest={handleCancellVacation}
        />
      </m.div>

      <AnimatedAlertWrapper open={alertState.open}>
        <Alert
          type={alertState.type}
          title={alertState.type === "success" ? "Éxito" : "Error"}
          message={alertState.message}
          onClose={() => setAlertState((prev) => ({ ...prev, open: false }))}
        />
      </AnimatedAlertWrapper>
    </LazyMotion>
  );
}
