import {
  Breadcrumb,
  Modal,
  useTheme,
  Dropdown,
  Button,
  Alert,
  AnimatedAlertWrapper,
} from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { m, LazyMotion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { ControlVacationPageHeader } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-page-header/control-vacation-page-header";
import { ControlVacationDirectActions } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-direct-actions/control-vacation-direct-actions";
import { useControlVacations } from "@app/modules/payroll/ui/hooks/vacation/useControlVacations";
import type {
  ControlVacationHistoryRequest,
  VacationReportType,
} from "@app/modules/payroll/domain/ApiContract/Requests/control-vacation-requests/control-vacations-request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { ControlVacationsTable } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/control-vacations-table";
import { ControlVacationFiltersBar } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/filters-bar";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import type { VacationAccruals } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";
import { VacationAccrualPdfDocument } from "@app/modules/payroll/ui/pages/control-vacations/components/vacation-accrual-pdf/vacation-accrual-pdf-document";
import {
  CONTROL_VACATIONS_SELECTION_STORAGE_KEY,
  DEFAULT_PAGE_SIZE,
} from "@app/modules/payroll/ui/pages/control-vacations/constants/vacations-contants";
import { isValidVacationReportType } from "@app/modules/payroll/ui/pages/control-vacations/utils/verified-vacations";
import type { StoredControlVacationsSelection } from "@app/modules/payroll/ui/pages/control-vacations/types/control-vacation.types";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

export default function ControlVacationsPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode } = useUserStore();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);

  const { GetBranchesQuery: branchesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );
  const branchOptions = useMemo(
    () =>
      (branchesQuery.data ?? []).map((b) => ({
        label: b.branch_name,
        value: b.branch_id,
      })),
    [branchesQuery.data],
  );

  const [selectedVacationType, setSelectedVacationType] =
    useState<VacationReportType | null>(null);
  const [tempSelectedType, setTempSelectedType] =
    useState<VacationReportType | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [tempSelectedBranch, setTempSelectedBranch] = useState<string | null>(
    null,
  );
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(true);
  const [selectionHydrated, setSelectionHydrated] = useState(false);
  const [selectedReportAction, setSelectedReportAction] =
    useState<VacationReportType | null>(null);
  const [identificationFilter, setIdentificationFilter] = useState("");
  const [workAreaFilter, setWorkAreaFilter] = useState<number | null>(null);
  const [filterBarSubmitPending, setFilterBarSubmitPending] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const selectionStorageKey = useMemo(() => {
    if (!companyId || !moduleCode) return null;
    return `${CONTROL_VACATIONS_SELECTION_STORAGE_KEY}:${companyId}:${moduleCode}`;
  }, [companyId, moduleCode]);

  const historyFilters = useMemo<
    ControlVacationHistoryRequest | undefined
  >(() => {
    if (!companyId || !moduleCode || !selectedVacationType || !selectedBranch)
      return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      type: selectedVacationType,
      branch_id: selectedBranch,
      identification_number: identificationFilter || undefined,
      work_area_id: workAreaFilter || undefined,
      page_size: DEFAULT_PAGE_SIZE,
      page_number: pageNumber,
    };
  }, [
    companyId,
    moduleCode,
    selectedVacationType,
    selectedBranch,
    identificationFilter,
    workAreaFilter,
    pageNumber,
  ]);

  const hasAppliedFilters = Boolean(selectedVacationType && selectedBranch);

  const { GetControlVacationHistoryQuery, getVacationReportData } =
    useControlVacations({
      filtersVacations: historyFilters,
    });

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setShowAlert({ show: false, type: "info", title: "", message: "" });
    }, 3000);
  }, []);

  const extractErrorMessage = useCallback(
    (error: unknown, fallback: string): string => {
      const errorObj = error as
        | {
            error?: { description?: string };
            response?: { data?: { error?: { description?: string } } };
          }
        | undefined;

      if (errorObj?.error?.description) return errorObj.error.description;
      if (errorObj?.response?.data?.error?.description) {
        return errorObj.response.data.error.description;
      }
      if (error instanceof Error && error.message) {
        return error.message;
      }
      return fallback;
    },
    [],
  );

  useEffect(() => {
    if (
      filterBarSubmitPending &&
      !GetControlVacationHistoryQuery.isFetching &&
      GetControlVacationHistoryQuery.isError
    ) {
      setShowAlert({
        show: true,
        type: "error",
        title: "Error al aplicar filtros",
        message: extractErrorMessage(
          GetControlVacationHistoryQuery.error,
          "No se pudo consultar el control de vacaciones con los filtros aplicados.",
        ),
      });
      handleCloseAlert();
    }

    if (!GetControlVacationHistoryQuery.isFetching && filterBarSubmitPending) {
      setFilterBarSubmitPending(false);
    }
  }, [
    GetControlVacationHistoryQuery.isFetching,
    GetControlVacationHistoryQuery.isError,
    GetControlVacationHistoryQuery.error,
    filterBarSubmitPending,
    extractErrorMessage,
    handleCloseAlert,
  ]);

  useEffect(() => {
    if (selectionHydrated) return;
    if (!selectionStorageKey || branchesQuery.isPending) return;

    const storedSelectionRaw = localStorage.getItem(selectionStorageKey);
    if (!storedSelectionRaw) {
      setSelectionHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(
        storedSelectionRaw,
      ) as Partial<StoredControlVacationsSelection>;
      const restoredType = parsed.type;
      const restoredBranch = parsed.branch_id;

      const hasValidType = isValidVacationReportType(restoredType);
      const hasValidBranch =
        typeof restoredBranch === "string" &&
        branchOptions.some((branch) => branch.value === restoredBranch);

      if (!hasValidType || !hasValidBranch) {
        localStorage.removeItem(selectionStorageKey);
        setSelectionHydrated(true);
        return;
      }

      setSelectedVacationType(restoredType);
      setSelectedBranch(restoredBranch);
      setTempSelectedType(restoredType);
      setTempSelectedBranch(restoredBranch);
      setSelectedReportAction(restoredType);
      setIsSelectionModalOpen(false);
      setSelectionHydrated(true);
    } catch {
      localStorage.removeItem(selectionStorageKey);
      setSelectionHydrated(true);
    }
  }, [selectionStorageKey, branchOptions, branchesQuery.isPending]);

  const historyPayload = GetControlVacationHistoryQuery.data;

  const rows: VacationAccruals[] = useMemo(() => {
    if (!hasAppliedFilters || !historyPayload) return [];
    return historyPayload.data ?? [];
  }, [hasAppliedFilters, historyPayload]);

  const totalRecords = useMemo(() => {
    if (!hasAppliedFilters || !historyPayload) return 0;
    const total = historyPayload.total;
    return typeof total === "number" && Number.isFinite(total) ? total : 0;
  }, [hasAppliedFilters, historyPayload]);

  const pageSizeForTable = useMemo(() => {
    if (!hasAppliedFilters || !historyPayload) return DEFAULT_PAGE_SIZE;
    const size = historyPayload.page_size;
    return typeof size === "number" && Number.isFinite(size) && size > 0
      ? size
      : DEFAULT_PAGE_SIZE;
  }, [hasAppliedFilters, historyPayload]);

  const handleApplyFilters = useCallback(
    (filters: { identification_number?: string; work_area_id?: number }) => {
      setFilterBarSubmitPending(true);
      setIdentificationFilter(filters.identification_number ?? "");
      setWorkAreaFilter(filters.work_area_id ?? null);

      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("page", "1");
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const handleClearFilters = useCallback(() => {
    setFilterBarSubmitPending(true);
    setIdentificationFilter("");
    setWorkAreaFilter(null);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("page");
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("page", page.toString());
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const handleSelectionModalClose = useCallback(() => {
    if (selectedVacationType === null || selectedBranch === null) {
      navigate("/dashboard");
    } else {
      setIsSelectionModalOpen(false);
    }
  }, [selectedVacationType, selectedBranch, navigate]);

  const handleConfirmTypeSelection = useCallback(() => {
    if (tempSelectedType && tempSelectedBranch) {
      setSelectedVacationType(tempSelectedType);
      setSelectedBranch(tempSelectedBranch);
      setSelectedReportAction(tempSelectedType);
      setIsSelectionModalOpen(false);

      if (selectionStorageKey) {
        const selectionToStore: StoredControlVacationsSelection = {
          type: tempSelectedType,
          branch_id: tempSelectedBranch,
        };
        localStorage.setItem(
          selectionStorageKey,
          JSON.stringify(selectionToStore),
        );
      }

      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("page", "1");
      setSearchParams(nextParams);
    }
  }, [
    tempSelectedType,
    tempSelectedBranch,
    selectionStorageKey,
    searchParams,
    setSearchParams,
  ]);

  const handleGenerateReport = useCallback(async () => {
    if (!selectedReportAction || !companyId || !moduleCode) return;
    if (selectedReportAction !== "VacationAccrual") {
      setShowAlert({
        show: true,
        type: "warning",
        title: "Reporte no disponible",
        message:
          "Por el momento solo esta disponible el reporte de Acumulado de Vacaciones.",
      });
      handleCloseAlert();
      return;
    }

    if (!historyFilters) {
      setShowAlert({
        show: true,
        type: "warning",
        title: "Faltan parámetros",
        message: "Seleccione el tipo de reporte y la sucursal para continuar.",
      });
      handleCloseAlert();
      return;
    }

    try {
      setIsGeneratingPdf(true);

      const response = await getVacationReportData({
        ...historyFilters,
        page_number: 1,
        page_size: totalRecords > 0 ? totalRecords : DEFAULT_PAGE_SIZE,
      });

      const reportData = response.data ?? [];
      if (!reportData.length) {
        throw new Error("No hay datos para generar el reporte.");
      }

      const dateLabel = new Date().toLocaleDateString("es-NI");
      const blob = await pdf(
        <VacationAccrualPdfDocument
          data={reportData}
          generatedAt={dateLabel}
          preparedBy={{
            name: "Lic Aracelly Guillen",
            role: "Talento Humano",
          }}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      setShowAlert({
        show: true,
        type: "error",
        title: "Error al generar reporte",
        message: extractErrorMessage(
          error,
          "No se pudo generar el reporte de acumulado de vacaciones. Inténtelo nuevamente.",
        ),
      });
      handleCloseAlert();
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [
    selectedReportAction,
    companyId,
    moduleCode,
    historyFilters,
    totalRecords,
    getVacationReportData,
    extractErrorMessage,
    handleCloseAlert,
  ]);

  const handleOpenChangeSelection = useCallback(() => {
    setTempSelectedType(selectedVacationType);
    setTempSelectedBranch(selectedBranch);
    setIsSelectionModalOpen(true);
  }, [selectedVacationType, selectedBranch]);

  const vacationTypeOptions: {
    label: string;
    value: VacationReportType;
  }[] = [{ label: "saldo de Vacaciones", value: "VacationAccrual" }];

  return (
    <LazyMotion features={loadFeatures} strict>
      <Modal
        isOpen={
          selectionHydrated &&
          (isSelectionModalOpen || selectedVacationType === null)
        }
        onClose={handleSelectionModalClose}
        variant="default"
        size="sm"
        title="Seleccionar Control de Vacaciones"
        description="Por favor, seleccione el tipo de reporte y la sucursal que desea consultar."
      >
        <div className="mt-4 flex flex-col gap-4">
          <Dropdown
            label="Tipo de control"
            placeholder="Seleccione tipo"
            options={vacationTypeOptions}
            value={tempSelectedType || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) =>
              setTempSelectedType(value as VacationReportType)
            }
          />
          <Dropdown
            label="Sucursal"
            placeholder="Seleccione una sucursal"
            options={branchOptions}
            value={tempSelectedBranch || undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) => setTempSelectedBranch(String(value))}
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Consultar"
            onClick={handleConfirmTypeSelection}
            disabled={!tempSelectedType || !tempSelectedBranch}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleSelectionModalClose}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {selectionHydrated &&
          hasAppliedFilters &&
          GetControlVacationHistoryQuery.isPending && (
            <Loader title="Cargando control de vacaciones..." />
          )}

        <div className="flex justify-start">
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                url: "/",
                onClick: (url) => navigate(url),
              },
              {
                label: "Control de vacaciones",
                url: "/payroll/control-vacations",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <ControlVacationPageHeader logoSrc={activeLogo} />

        <ControlVacationDirectActions
          reportOptions={vacationTypeOptions}
          selectedReportAction={selectedReportAction}
          onReportActionChange={setSelectedReportAction}
          onGenerate={handleGenerateReport}
          isGenerating={isGeneratingPdf}
          onOpenChangeSelection={handleOpenChangeSelection}
          canChangeSelection
        />

        {selectedVacationType && selectedBranch && (
          <>
            <ControlVacationFiltersBar
              isApplyingFilters={
                filterBarSubmitPending &&
                GetControlVacationHistoryQuery.isFetching
              }
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />

            <ControlVacationsTable
              rows={rows}
              currentPage={pageNumber}
              pageSize={pageSizeForTable}
              totalRecords={totalRecords}
              onPageChange={handlePageChange}
              isPending={
                hasAppliedFilters && GetControlVacationHistoryQuery.isFetching
              }
            />
          </>
        )}
      </m.div>

      <AnimatedAlertWrapper open={showAlert.show}>
        <Alert
          type={showAlert.type}
          title={showAlert.title}
          message={showAlert.message}
          onClose={() => setShowAlert((prev) => ({ ...prev, show: false }))}
        />
      </AnimatedAlertWrapper>
    </LazyMotion>
  );
}
