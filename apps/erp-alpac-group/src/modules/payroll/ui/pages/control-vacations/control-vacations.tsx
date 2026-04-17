import { Breadcrumb, Modal, useTheme } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import { Construction } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ControlVacationPageHeader } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-page-header/control-vacation-page-header";
import { ControlVacationDirectActions } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-direct-actions/control-vacation-direct-actions";
import { useControlVacations } from "@app/modules/payroll/ui/hooks/useVacations";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacations-request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { ControlVacationsTable } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/control-vacations-table";
import { ControlVacationDetailsModal } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/control-vacation-details-modal";
import { ControlVacationFiltersBar } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/filters-bar";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { AppliedDateRange } from "@app/modules/payroll/ui/pages/control-vacations/utils/date-range";
import type { VacationControlItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";

const DEFAULT_PAGE_SIZE = 10;

export default function ControlVacationsPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode } = useUserStore();

  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const dateRange = useMemo<AppliedDateRange>(() => {
    return {
      start_date: searchParams.get("start_date"),
      end_date: searchParams.get("end_date"),
    };
  }, [searchParams]);

  const historyFilters = useMemo<
    ControlVacationHistoryRequest | undefined
  >(() => {
    if (!companyId || !moduleCode) return undefined;
    if (!dateRange.start_date || !dateRange.end_date) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
      page_size: DEFAULT_PAGE_SIZE,
      page_number: pageNumber,
    };
  }, [companyId, moduleCode, dateRange, pageNumber]);

  const hasAppliedDateRange = Boolean(
    dateRange.start_date && dateRange.end_date,
  );

  const { GetControlVacationHistoryQuery } = useControlVacations({
    filtersVacations: historyFilters,
  });

  const [reportDevModalOpen, setReportDevModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VacationControlItemResponse | null>(null);

  const historyPayload = GetControlVacationHistoryQuery.data;

  const rows: VacationControlItemResponse[] = useMemo(() => {
    if (!hasAppliedDateRange || !historyPayload) return [];
    return historyPayload.data ?? [];
  }, [hasAppliedDateRange, historyPayload]);

  const totalRecords = useMemo(() => {
    if (!hasAppliedDateRange || !historyPayload) return 0;
    const total = historyPayload.total;
    return typeof total === "number" && Number.isFinite(total) ? total : 0;
  }, [hasAppliedDateRange, historyPayload]);

  const pageSizeForTable = useMemo(() => {
    if (!hasAppliedDateRange || !historyPayload) return DEFAULT_PAGE_SIZE;
    const size = historyPayload.page_size;
    return typeof size === "number" && Number.isFinite(size) && size > 0
      ? size
      : DEFAULT_PAGE_SIZE;
  }, [hasAppliedDateRange, historyPayload]);

  const handleApplyDateFilters = useCallback(
    (range: { start_date: string; end_date: string }) => {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("start_date", range.start_date);
      nextParams.set("end_date", range.end_date);
      nextParams.set("page", "1");
      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const handleClearFilters = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("start_date");
    nextParams.delete("end_date");
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

  const handleOpenReportDevModal = useCallback(() => {
    setReportDevModalOpen(true);
  }, []);

  if (
    historyFilters &&
    GetControlVacationHistoryQuery.fetchStatus === "fetching" &&
    GetControlVacationHistoryQuery.data === undefined
  ) {
    return <Loader title="Cargando control de vacaciones..." />;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
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
                label: "Control de vacaciones",
                url: "/payroll/control-vacations",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <ControlVacationPageHeader logoSrc={activeLogo} />

        <ControlVacationDirectActions
          onGenerateReport={handleOpenReportDevModal}
        />

        <ControlVacationFiltersBar
          initialStart={dateRange.start_date}
          initialEnd={dateRange.end_date}
          isApplyingFilters={
            hasAppliedDateRange && GetControlVacationHistoryQuery.isFetching
          }
          onApply={handleApplyDateFilters}
          onClear={handleClearFilters}
        />

        <ControlVacationsTable
          rows={rows}
          currentPage={pageNumber}
          pageSize={pageSizeForTable}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          isPending={
            hasAppliedDateRange && GetControlVacationHistoryQuery.isFetching
          }
          onViewDetails={setSelectedItem}
        />
      </motion.div>

      <Modal
        isOpen={reportDevModalOpen}
        onClose={() => setReportDevModalOpen(false)}
        variant="info"
        size="md"
        title="Generar reporte"
      >
        <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-neutral-600 dark:bg-neutral-800/60">
          <Construction
            className="shrink-0 text-amber-500 dark:text-amber-400"
            size={28}
            strokeWidth={1.75}
            aria-hidden
          />
          <p className="m-0 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            En este momento esta característica del sistema se encuentra en
            desarrollo.
          </p>
        </div>
      </Modal>

      <ControlVacationDetailsModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </>
  );
}
