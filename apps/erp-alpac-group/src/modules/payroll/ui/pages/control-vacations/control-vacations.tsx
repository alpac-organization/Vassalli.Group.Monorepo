import {
  Breadcrumb,
  Modal,
  useTheme,
  Dropdown,
  Button,
} from "@alpac/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const DEFAULT_PAGE_SIZE = 10;

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
  const branchOptions = (branchesQuery.data ?? []).map((b) => ({
    label: b.branch_name,
    value: b.branch_id,
  }));

  const [selectedVacationType, setSelectedVacationType] =
    useState<VacationReportType | null>(null);
  const [tempSelectedType, setTempSelectedType] =
    useState<VacationReportType | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [tempSelectedBranch, setTempSelectedBranch] = useState<string | null>(
    null,
  );
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(true);
  const [selectedReportAction, setSelectedReportAction] =
    useState<VacationReportType | null>(null);
  const [identificationFilter, setIdentificationFilter] = useState("");
  const [workAreaFilter, setWorkAreaFilter] = useState<number | null>(null);
  const [filterBarSubmitPending, setFilterBarSubmitPending] = useState(false);

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

  const { GetControlVacationHistoryQuery } = useControlVacations({
    filtersVacations: historyFilters,
  });

  useEffect(() => {
    if (!GetControlVacationHistoryQuery.isFetching && filterBarSubmitPending) {
      setFilterBarSubmitPending(false);
    }
  }, [GetControlVacationHistoryQuery.isFetching, filterBarSubmitPending]);

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
      setIsSelectionModalOpen(false);

      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("page", "1");
      setSearchParams(nextParams);
    }
  }, [tempSelectedType, tempSelectedBranch, searchParams, setSearchParams]);

  const handleGenerateReport = useCallback(() => {
    if (!selectedReportAction) return;
  }, [selectedReportAction]);

  const handleOpenChangeSelection = useCallback(() => {
    setTempSelectedType(selectedVacationType);
    setTempSelectedBranch(selectedBranch);
    setIsSelectionModalOpen(true);
  }, [selectedVacationType, selectedBranch]);

  const vacationTypeOptions: {
    label: string;
    value: VacationReportType;
  }[] = [
    { label: "Acumulado de Vacaciones", value: "VacationAccrual" },
    { label: "Solicitud de Vacaciones", value: "VacationRequest" },
  ];

  return (
    <>
      <Modal
        isOpen={isSelectionModalOpen || selectedVacationType === null}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {hasAppliedFilters && GetControlVacationHistoryQuery.isPending && (
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
          isGenerating={false}
          onOpenChangeSelection={handleOpenChangeSelection}
          canChangeSelection={hasAppliedFilters}
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
      </motion.div>
    </>
  );
}
