import { Pagination } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import type { GetFaultsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-faults.request";
import { useFault } from "@app/modules/payroll/ui/hooks/fault/useFault";
import { FaultsFilters } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-filters/faults-filters";
import type { FaultsFilterFormValues } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-filters/faults-filters.types";
import { FaultsTable } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-table/faults-table";
import { FaultDetailsModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/fault-details-modal/fault-details-modal";
import { RegisterFaultModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-fault-modal/register-fault-modal";
import { RegisterSanctionModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/register-sanction-modal/register-sanction-modal";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";

const PAGE_SIZE = 10;

type FaultsTabProps = {
  canWrite?: boolean;
};

export const FaultsTab = ({ canWrite = true }: FaultsTabProps) => {
  const { companyId, moduleCode } = useUserStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<FaultsFilterFormValues>({
    code: "",
    severity: "all",
    status: "all",
    source: "all",
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSanctionOpen, setIsSanctionOpen] = useState(false);
  const [selectedFault, setSelectedFault] = useState<FaultDto | null>(null);

  const faultsFilters = useMemo<GetFaultsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedFilters.code.trim() && { code: appliedFilters.code.trim() }),
      ...(appliedFilters.severity !== "all" && {
        severity: appliedFilters.severity,
      }),
      ...(appliedFilters.status !== "all" && { status: appliedFilters.status }),
      ...(appliedFilters.source !== "all" && { source: appliedFilters.source }),
    }),
    [companyId, moduleCode, pageNumber, appliedFilters],
  );

  const faultDetailFilters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      fault_id: selectedFault?.fault_id ?? "",
    }),
    [companyId, moduleCode, selectedFault?.fault_id],
  );

  const { GetFaults, GetFaultDetails } = useFault({
    faultsFilters,
    faultDetailFilters: isDetailOpen ? faultDetailFilters : undefined,
  });

  const handleApplyFilters = useCallback((values: FaultsFilterFormValues) => {
    setAppliedFilters(values);
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters({
      code: "",
      severity: "all",
      status: "all",
      source: "all",
    });
    setPageNumber(1);
  }, []);

  const handleViewDetail = useCallback((row: FaultDto) => {
    setSelectedFault(row);
    setIsDetailOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {(GetFaults.isLoading || GetFaults.isFetching) && (
        <Loader title="Cargando faltas disciplinarias..." />
      )}

      <FaultsFilters
        canWrite={canWrite}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onRegisterFault={() => setIsRegisterOpen(true)}
      />

      <FaultsTable
        data={GetFaults.data?.data ?? []}
        onViewDetail={handleViewDetail}
        pagination={
          <Pagination
            currentPage={GetFaults.data?.page_number ?? pageNumber}
            pageSize={GetFaults.data?.page_size ?? PAGE_SIZE}
            totalRecords={GetFaults.data?.total ?? 0}
            onPageChange={handlePageChange}
            disabled={GetFaults.isFetching}
          />
        }
      />

      <RegisterFaultModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <FaultDetailsModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedFault(null);
        }}
        summary={selectedFault}
        detail={GetFaultDetails.data}
        isDetailLoading={GetFaultDetails.isLoading || GetFaultDetails.isFetching}
        canWrite={canWrite}
        onCancelFault={() => {
          setIsDetailOpen(false);
          setSelectedFault(null);
        }}
        onApplySanction={() => {
          setIsDetailOpen(false);
          setIsSanctionOpen(true);
        }}
      />

      <RegisterSanctionModal
        isOpen={isSanctionOpen}
        onClose={() => {
          setIsSanctionOpen(false);
          setSelectedFault(null);
        }}
        faultSummary={selectedFault}
      />
    </div>
  );
};
