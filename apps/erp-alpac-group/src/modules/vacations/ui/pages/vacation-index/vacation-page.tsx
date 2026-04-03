import { Breadcrumb } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type {
  VacationRequestRow,
  VacationStatusFilterValue,
} from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
import { VacationFiltersBar } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-filters-bar";
import { VacationPageHeader } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-page-header";
import { VacationRequestsTable } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-requests-table";
import { VacationStatsSection } from "@app/modules/vacations/ui/pages/vacation-index/components/vacation-stats-section";
import { NewVacationRequestModal } from "@app/modules/vacations/ui/pages/vacation-index/components/new-vacation-request/new-vacation-request-modal";
import { useSaldoVacationRequest } from "@app/modules/vacations/ui/hooks/useSaldoVacationRequest";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCollaboratorProfileDetails } from "@app/modules/payroll/ui/hooks/useCollaboratorProfile";

export default function VacationPage() {
  const navigate = useNavigate();
  const { companyId, moduleCode, identificationNumber, fullName } =
    useUserStore();
  const { GetVacationSaldoQuery } = useSaldoVacationRequest();
  const { GetProfileDetails } = useCollaboratorProfileDetails({
    company_id: companyId,
    module_code: moduleCode,
    identification_number: identificationNumber,
  });
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

  const newVacationModalFullName = useMemo(() => {
    const fromSaldo = GetVacationSaldoQuery.data?.full_name?.trim();
    if (fromSaldo) return fromSaldo;
    const fromProfile = GetProfileDetails.data?.full_name?.trim();
    if (fromProfile) return fromProfile;
    return fullName?.trim() ?? "";
  }, [
    GetVacationSaldoQuery.data?.full_name,
    GetProfileDetails.data?.full_name,
    fullName,
  ]);

  const newVacationModalWorkPosition = useMemo(() => {
    const p = GetProfileDetails.data;
    return (
      p?.work_position?.trim() ||
      p?.working_information?.work_position?.trim() ||
      ""
    );
  }, [GetProfileDetails.data]);

  const newVacationModalFullNameLoading = useMemo(() => {
    if (!saldoContextReady) return false;
    const hasText =
      Boolean(GetVacationSaldoQuery.data?.full_name?.trim()) ||
      Boolean(GetProfileDetails.data?.full_name?.trim()) ||
      Boolean(fullName?.trim());
    if (hasText) return false;
    return GetVacationSaldoQuery.isPending || GetProfileDetails.isPending;
  }, [
    saldoContextReady,
    GetVacationSaldoQuery.data?.full_name,
    GetVacationSaldoQuery.isPending,
    GetProfileDetails.data?.full_name,
    GetProfileDetails.isPending,
    fullName,
  ]);

  const newVacationModalWorkPositionLoading = useMemo(() => {
    if (!saldoContextReady) return false;
    if (newVacationModalWorkPosition) return false;
    return GetProfileDetails.isPending;
  }, [
    saldoContextReady,
    newVacationModalWorkPosition,
    GetProfileDetails.isPending,
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
        collaboratorFullName={newVacationModalFullName}
        collaboratorWorkPosition={newVacationModalWorkPosition}
        isCollaboratorFullNameLoading={newVacationModalFullNameLoading}
        isCollaboratorWorkPositionLoading={newVacationModalWorkPositionLoading}
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
