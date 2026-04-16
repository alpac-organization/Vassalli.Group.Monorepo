import { Breadcrumb, Modal, useTheme } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import { Construction } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ControlVacationPageHeader } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-page-header/control-vacation-page-header";
import { ControlVacationDirectActions } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-direct-actions/control-vacation-direct-actions";
import { useControlVacations } from "@app/modules/payroll/ui/hooks/useVacations";
import type { ControlVacationHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/control-vacations-request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { ControlVacationsTable } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/control-vacations-table";
import { ControlVacationFiltersBar } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-filters/filters-bar";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import {
  type AppliedDateRange,
  emptyDateRange,
  estimateTotalRecordsForPagination,
} from "@app/modules/payroll/ui/pages/control-vacations/utils/date-range";
import type { VacationControlItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";

const PAGE_SIZE = 10;

export default function ControlVacationsPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode } = useUserStore();

  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const [pageNumber, setPageNumber] = useState(1);
  const [dateRange, setDateRange] = useState<AppliedDateRange>(() =>
    emptyDateRange(),
  );
  const [filtersKey, setFiltersKey] = useState(0);

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
      page_size: PAGE_SIZE,
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

  const historyPayload = GetControlVacationHistoryQuery.data;

  const rows: VacationControlItemResponse[] = useMemo(() => {
    if (!hasAppliedDateRange || !historyPayload) return [];
    if (Array.isArray(historyPayload)) return historyPayload;
    return historyPayload.data ?? [];
  }, [hasAppliedDateRange, historyPayload]);

  const totalRecords = useMemo(() => {
    if (!hasAppliedDateRange) return 0;
    if (Array.isArray(historyPayload)) {
      return estimateTotalRecordsForPagination(
        historyPayload.length,
        pageNumber,
        PAGE_SIZE,
      );
    }
    const total = historyPayload?.total_records;
    if (typeof total === "number" && Number.isFinite(total)) {
      return total;
    }
    return estimateTotalRecordsForPagination(
      rows.length,
      pageNumber,
      PAGE_SIZE,
    );
  }, [
    hasAppliedDateRange,
    historyPayload,
    rows.length,
    pageNumber,
  ]);

  const handleApplyDateFilters = useCallback(
    (range: { start_date: string; end_date: string }) => {
      setDateRange({
        start_date: range.start_date,
        end_date: range.end_date,
      });
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setDateRange(emptyDateRange());
    setPageNumber(1);
    setFiltersKey((k) => k + 1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

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
          key={filtersKey}
          initialStart={dateRange.start_date}
          initialEnd={dateRange.end_date}
          onApply={handleApplyDateFilters}
          onClear={handleClearFilters}
        />

        <ControlVacationsTable
          rows={rows}
          currentPage={pageNumber}
          pageSize={PAGE_SIZE}
          totalRecords={totalRecords}
          onPageChange={handlePageChange}
          isPending={
            hasAppliedDateRange && GetControlVacationHistoryQuery.isFetching
          }
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
    </>
  );
}
