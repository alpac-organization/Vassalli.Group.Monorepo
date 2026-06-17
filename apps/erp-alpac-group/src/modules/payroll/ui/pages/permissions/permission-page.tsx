import {
  Alert,
  AnimatedAlertWrapper,
  Banner,
  Breadcrumb,
  Button,
  Pagination,
  RadioButton,
} from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, ArrowLeft } from "lucide-react";
import { m, LazyMotion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type {
  PermissionRequest,
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
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { usePayrollStatus } from "@app/modules/payroll/ui/hooks/payroll/usePayroll";
import {
  mapBranchNametoBranchId,
  mapSalaryTypeToPayrollType,
} from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/utils/utils_permissions";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const maxPageSize = 5;

type ViewTarget = "self" | "other";

export default function PermissionsPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber, fullName, role } =
    useUserStore();

  const isManager = role === RoleEnum.MANAGER;

  const [viewTarget, setViewTarget] = useState<ViewTarget>("self");
  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);

  const effectiveIdentification = useMemo(() => {
    if (isManager && viewTarget === "other" && foundCollaborator) {
      return (
        foundCollaborator.personal_information?.identification_number ??
        identificationNumber
      );
    }
    return identificationNumber;
  }, [isManager, viewTarget, foundCollaborator, identificationNumber]);

  const isViewingOtherCollaborator =
    isManager && viewTarget === "other" && foundCollaborator !== null;

  const viewedCollaboratorFullName = useMemo(() => {
    if (isViewingOtherCollaborator) {
      return foundCollaborator.full_name ?? fullName;
    }
    return fullName;
  }, [isViewingOtherCollaborator, foundCollaborator, fullName]);

  const [filterDraft, setFilterDraft] =
    useState<VacationStatusFilterValue>("all");
  const [appliedStatus, setAppliedStatus] =
    useState<VacationStatusFilterValue>("all");

  const [typeDraft, setTypeDraft] = useState<PermissionTypeFilterValue>("all");
  const [appliedType, setAppliedType] =
    useState<PermissionTypeFilterValue>("all");
  const [pageNumber, setPageNumber] = useState(1);

  const vacationSaldoPayload = useMemo<UseVacationPayload | undefined>(() => {
    if (!companyId || !moduleCode || !effectiveIdentification) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: effectiveIdentification,
    };
  }, [companyId, moduleCode, effectiveIdentification]);

  const saldoContextReady = Boolean(vacationSaldoPayload);

  const historyFilters = useMemo<PermissionRequest | undefined>(() => {
    if (!companyId || !moduleCode) return undefined;
    return {
      companie_id: companyId,
      module_code: moduleCode,
      identification_number: effectiveIdentification,
      page_size: maxPageSize,
      page_number: pageNumber,
      ...(appliedStatus !== "all" && { status: appliedStatus }),
      ...(appliedType !== "all" && { type: appliedType }),
    };
  }, [
    companyId,
    moduleCode,
    effectiveIdentification,
    appliedStatus,
    appliedType,
    pageNumber,
  ]);

  useEffect(() => {
    setPageNumber(1);
  }, [effectiveIdentification]);

  const { GetProfileDetails: viewedProfileQuery } = useCollaborators({
    CollaboratorDetailsPayload: {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: effectiveIdentification ?? "",
    },
  });

  const { GetProfileDetails: requestorProfileQuery } = useCollaborators({
    CollaboratorDetailsPayload: {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: identificationNumber ?? "",
      QueryEnabled: isViewingOtherCollaborator,
    },
  });

  const requestorProfile = isViewingOtherCollaborator
    ? requestorProfileQuery
    : viewedProfileQuery;

  const {
    GetPermissionHistory,
    cancelPermissionRequestMutation,
    //  generatePermissionDocumentMutation,
  } = usePermission(historyFilters);
  const branches = useCompanies({
    company_id: companyId ?? "",
  });

  const requestorPayrollStatusQuery = usePayrollStatus({
    payload: {
      companie_id: companyId,
      module_code: moduleCode,
      branch_id:
        mapBranchNametoBranchId(
          requestorProfile.data?.working_information.branch_name ?? "",
          branches.GetBranchesQuery.data ?? [],
        ) ?? "",
      payrol_type: mapSalaryTypeToPayrollType(
        requestorProfile.data?.salary_information.salary_type ?? "Fixed",
      ),
    },
  });

  const requestorPayrollId = useMemo(() => {
    if (
      requestorPayrollStatusQuery.isSuccess &&
      requestorPayrollStatusQuery.data?.exist_payroll_in_progress
    ) {
      return requestorPayrollStatusQuery.data.payroll_id;
    }
    return;
  }, [requestorPayrollStatusQuery.isSuccess, requestorPayrollStatusQuery.data]);

  const { GetVacationSaldoQuery } = useVacation(vacationSaldoPayload);

  const requestorModalContextReady = Boolean(
    companyId && moduleCode && identificationNumber,
  );

  const balanceVacation = useMemo(() => {
    const querySaldoVacation = {
      isLoading: GetVacationSaldoQuery.isPending,
      isError: GetVacationSaldoQuery.isError,
      datos: GetVacationSaldoQuery.data,
    };
    return derivarUiSaldoVacaciones(saldoContextReady, querySaldoVacation);
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data,
  ]);

  const viewedCollaboratorUi = useMemo(() => {
    const querySaldoVacation = {
      isLoading: GetVacationSaldoQuery.isPending,
      isError: GetVacationSaldoQuery.isError,
      datos: GetVacationSaldoQuery.data,
    };
    const queryPerfilVacation = {
      isLoading: viewedProfileQuery.isPending,
      datos: viewedProfileQuery.data,
    };
    return derivarUiModalNuevaPermission(
      saldoContextReady,
      querySaldoVacation,
      queryPerfilVacation,
      viewedCollaboratorFullName,
    );
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data,
    viewedProfileQuery.isPending,
    viewedProfileQuery.data,
    viewedCollaboratorFullName,
  ]);

  const requestorCollaboratorUi = useMemo(() => {
    const queryPerfilSolicitante = {
      isLoading: requestorProfile.isPending,
      datos: requestorProfile.data,
    };
    return derivarUiModalNuevaPermission(
      requestorModalContextReady,
      { isLoading: false, isError: false, datos: undefined },
      queryPerfilSolicitante,
      fullName,
    );
  }, [
    requestorModalContextReady,
    requestorProfile.isPending,
    requestorProfile.data,
    fullName,
  ]);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);

  const [selectedPermissionItem, setSelectedPermissionItem] =
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
    setIsNewRequestOpen(false);
    setAlertState({ open: true, type: "error", message: description });
  }, []);

  const permissionRows = useMemo(
    () => GetPermissionHistory.data?.data ?? [],
    [GetPermissionHistory.data],
  );
  const handleApplyFilters = useCallback(() => {
    setAppliedStatus(filterDraft);
    setAppliedType(typeDraft);
    setPageNumber(1);
  }, [filterDraft, typeDraft]);

  const handleClearFilters = useCallback(() => {
    setFilterDraft("all");
    setAppliedStatus("all");
    setTypeDraft("all");
    setAppliedType("all");
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleViewDetails = useCallback((item: PermissionResponse) => {
    setSelectedPermissionItem(item);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedPermissionItem(null);
  }, []);

  //   const handleGenerateDocument = useCallback((_item: PermissionResponse) => {
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
    (item: PermissionResponse) => {
      if (!companyId || !moduleCode) return;
      cancelPermissionRequestMutation.mutate(
        {
          company_id: companyId,
          module_code: moduleCode,
          permit_application_id: item.permit_apllication_id,
        },
        {
          onSuccess: () => {
            setAlertState({
              open: true,
              type: "success",
              message: "Su solicitud ha sido cancelada exitosamente.",
            });
          },
          onError: (error) => {
            const apiDescription =
              error && typeof error === "object" && "error" in error
                ? (error as ApiErrorResponse).error?.description
                : undefined;

            setAlertState({
              open: true,
              type: "error",
              message:
                apiDescription ??
                "No se pudo cancelar la solicitud. Intente nuevamente.",
            });
          },
        },
      );
    },
    [companyId, moduleCode, cancelPermissionRequestMutation],
  );

  const showInitialPageLoader = utilsPermissionPageInitialLoader({
    contextReady: saldoContextReady,
    isSaldoPending: GetVacationSaldoQuery.isPending,
    isProfilePending: viewedProfileQuery.isPending,
    isHistoryPending: GetPermissionHistory.isPending,
  });

  const loadError = GetVacationSaldoQuery.isError
    ? GetVacationSaldoQuery.error
    : viewedProfileQuery.isError
      ? viewedProfileQuery.error
      : GetPermissionHistory.isError
        ? GetPermissionHistory.error
        : undefined;

  const isLoadError =
    GetVacationSaldoQuery.isError ||
    viewedProfileQuery.isError ||
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

        {isManager && (
          <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600 mb-2">
            <h4 className="mb-4 pb-4 text-sm font-medium text-black dark:text-white">
              ¿De quién deseas ver la información?
            </h4>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 mb-4">
              <RadioButton
                name="page-view-target"
                value="self"
                checked={viewTarget === "self"}
                onChange={() => {
                  setViewTarget("self");
                  setFoundCollaborator(null);
                }}
                label="Mis permisos"
              />
              <RadioButton
                name="page-view-target"
                value="other"
                checked={viewTarget === "other"}
                onChange={() => setViewTarget("other")}
                label="Permisos de un colaborador"
              />
            </div>

            <AnimatePresence mode="wait">
              {viewTarget === "other" && !foundCollaborator && (
                <m.div
                  key="search-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CollaboratorSearchForm
                    onSuccess={(collaborator) => {
                      setFoundCollaborator(collaborator);
                    }}
                    onError={() => {
                      setFoundCollaborator(null);
                    }}
                    onSearchStart={() => {}}
                    excludeIdentifications={[identificationNumber]}
                  />
                </m.div>
              )}

              {viewTarget === "other" && foundCollaborator && (
                <m.div
                  key="collaborator-summary"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2"
                >
                  <div className="flex-1">
                    <CollaboratorSummary
                      fullName={foundCollaborator.full_name ?? ""}
                      workPosition={foundCollaborator.work_position ?? ""}
                      title="Colaborador Seleccionado"
                      subtitle="Puesto de Trabajo"
                    />
                  </div>
                  <Button
                    type="button"
                    size="small"
                    icon={<ArrowLeft size={16} />}
                    label="Volver a mis permisos"
                    className="shrink-0 text-[13px]! bg-transparent! border! border-slate-500! text-slate-700! dark:border-slate-500! dark:text-slate-300!"
                    onClick={() => {
                      setViewTarget("self");
                      setFoundCollaborator(null);
                    }}
                  />
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <NewPermissionRequestModal
          isOpen={isNewRequestOpen}
          onClose={() => setIsNewRequestOpen(false)}
          payrollId={requestorPayrollId}
          collaboratorFullName={
            requestorCollaboratorUi.nombreCompletoColaborador
          }
          collaboratorWorkPosition={
            requestorCollaboratorUi.puestoDeTrabajoColaborador
          }
          isCollaboratorFullNameLoading={
            requestorCollaboratorUi.nombreColaboradorCargando
          }
          isCollaboratorWorkPositionLoading={
            requestorCollaboratorUi.puestoColaboradorCargando
          }
          onRequestSuccess={handleRequestSuccess}
          onRequestError={handleRequestError}
        />

        <PermissionRequestDetailsModal
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          item={selectedPermissionItem}
          collaboratorFullName={viewedCollaboratorUi.nombreCompletoColaborador}
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
          data={permissionRows}
          onViewDetails={handleViewDetails}
          //  onGenerateDocument={handleGenerateDocument}
          onCancelRequest={handleCancellVacation}
          pagination={
            <Pagination
              currentPage={GetPermissionHistory.data?.page_number ?? 0}
              pageSize={GetPermissionHistory.data?.page_size ?? 0}
              totalRecords={GetPermissionHistory.data?.total ?? 0}
              onPageChange={handlePageChange}
              disabled={GetPermissionHistory.isFetching}
            />
          }
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
