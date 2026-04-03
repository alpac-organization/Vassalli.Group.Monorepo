import { Breadcrumb } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type {
  VacationRequestRow,
  VacationStatusFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/vacation-request.types";
import { VacationFiltersBar } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-filters-bar";
import { VacationPageHeader } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-page-header";
import { VacationRequestsTable } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-requests-table";
import { VacationStatsSection } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-stats-section";
import { NewVacationRequestModal } from "@app/modules/vacations/ui/pages/vacation-index/components/new-vacation-request/new-vacation-request-modal";
import { useSaldoVacationRequest } from "@app/modules/vacations/ui/hooks/useSaldoVacationRequest";
import { useUserStore } from "@app/shared/stores/useUserStore";

export default function VacationPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber } = useUserStore();
  const { GetVacationSaldoQuery } = useSaldoVacationRequest();

  const saldoContextReady = Boolean(
    companyId && moduleCode && identificationNumber,
  );

  const daysTakenDisplay = useMemo(() => {
    if (!saldoContextReady) return "—";
    if (GetVacationSaldoQuery.isPending) return "…";
    if (GetVacationSaldoQuery.isError) return "—";
    return String(GetVacationSaldoQuery.data?.enjoyed_vacation ?? "—");
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data?.enjoyed_vacation,
  ]);

  const daysRemainingDisplay = useMemo(() => {
    if (!saldoContextReady) return "—";
    if (GetVacationSaldoQuery.isPending) return "…";
    if (GetVacationSaldoQuery.isError) return "—";
    return String(GetVacationSaldoQuery.data?.available_vacations ?? "—");
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data?.available_vacations,
  ]);

  const daysGeneratedDisplay = useMemo(() => {
    if (!saldoContextReady) return "—";
    if (GetVacationSaldoQuery.isPending) return "…";
    if (GetVacationSaldoQuery.isError) return "—";
    return String(GetVacationSaldoQuery.data?.genered_vacation ?? "—");
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data?.genered_vacation,
  ]);

  const collaboratorDisplayName = useMemo(() => {
    if (!saldoContextReady) return undefined;
    if (GetVacationSaldoQuery.isPending || GetVacationSaldoQuery.isError)
      return undefined;
    const name = GetVacationSaldoQuery.data?.full_name?.trim();
    return name !== "" ? name : undefined;
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.isPending,
    GetVacationSaldoQuery.isError,
    GetVacationSaldoQuery.data?.full_name,
  ]);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [filterDraft, setFilterDraft] =
    useState<VacationStatusFilterValue>("all");
  const [appliedStatus, setAppliedStatus] =
    useState<VacationStatusFilterValue>("all");

  const filteredRows = useMemo<VacationRequestRow[]>(() => [], []);

  const handleApplyFilters = useCallback(() => {
    setAppliedStatus(filterDraft);
  }, [filterDraft]);

  const handleClearFilters = useCallback(() => {
    setFilterDraft("all");
    setAppliedStatus("all");
  }, []);

  const handleViewDetails = useCallback((row: VacationRequestRow) => {
    void row.id;
  }, []);

  return (
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
              label: "Gestión de vacaciones",
              url: "/work-management/gestion-vacations",
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <VacationPageHeader
        onNewRequest={() => setIsNewRequestOpen(true)}
        collaboratorDisplayName={collaboratorDisplayName}
      />

      <NewVacationRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
      />

      <VacationStatsSection
        daysTakenDisplay={daysTakenDisplay}
        daysRemainingDisplay={daysRemainingDisplay}
        daysGeneratedDisplay={daysGeneratedDisplay}
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
      />
    </motion.div>
  );
}
