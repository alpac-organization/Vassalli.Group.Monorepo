import { Breadcrumb } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type {
  VacationRequestRow,
  VacationStatusFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/vacation-request.types";
import { MOCK_VACATION_REQUESTS } from "@app/modules/vacations/ui/pages/vacation-index/mocks/vacation-requests.mock";
import { VacationFiltersBar } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-filters-bar";
import { VacationPageHeader } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-page-header";
import { VacationRequestsTable } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-requests-table";
import { VacationStatsSection } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-stats-section";

/** TODO: reemplazar por métricas desde API / usuario */
const MOCK_DAYS_TAKEN = "12";
const MOCK_DAYS_REMAINING = "8";
const MOCK_DAYS_GENERATED = "5";

export default function VacationPage() {
  const navigate = useNavigate();
  const [filterDraft, setFilterDraft] =
    useState<VacationStatusFilterValue>("all");
  const [appliedStatus, setAppliedStatus] =
    useState<VacationStatusFilterValue>("all");

  const filteredRows = useMemo(() => {
    if (appliedStatus === "all") return MOCK_VACATION_REQUESTS;
    return MOCK_VACATION_REQUESTS.filter((r) => r.status === appliedStatus);
  }, [appliedStatus]);

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

      <VacationPageHeader />

      <VacationStatsSection
        daysTakenDisplay={MOCK_DAYS_TAKEN}
        daysRemainingDisplay={MOCK_DAYS_REMAINING}
        daysGeneratedDisplay={MOCK_DAYS_GENERATED}
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
