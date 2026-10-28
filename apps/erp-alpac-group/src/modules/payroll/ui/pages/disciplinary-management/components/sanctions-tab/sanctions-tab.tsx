import { Pagination } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import type { GetSanctionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/disciplinary-requests/get-sanctions.request";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import { useSanction } from "@app/modules/payroll/ui/hooks/sanction/useSanction";
import { SanctionsFilters } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters";
import type { SanctionsFilterFormValues } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-filters/sanctions-filters.types";
import { SanctionsTable } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-table/sanctions-table";
import { SanctionDetailsModal } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanction-details-modal/sanction-details-modal";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";

const PAGE_SIZE = 10;

export const SanctionsTab = () => {
  const { companyId, moduleCode } = useUserStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<SanctionsFilterFormValues>({
      sanction_type: "all",
      sanction_status: "all",
    });

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSanction, setSelectedSanction] = useState<SanctionDto | null>(
    null,
  );

  const sanctionsFilters = useMemo<GetSanctionsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedFilters.sanction_type !== "all" && {
        sanction_type: appliedFilters.sanction_type,
      }),
      ...(appliedFilters.sanction_status !== "all" && {
        sanction_status: appliedFilters.sanction_status,
      }),
    }),
    [companyId, moduleCode, pageNumber, appliedFilters],
  );

  const sanctionDetailFilters = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      sanction_id: selectedSanction?.sanction_id ?? "",
    }),
    [companyId, moduleCode, selectedSanction?.sanction_id],
  );

  const { GetSanctions, GetSanctionDetails } = useSanction({
    sanctionsFilters,
    sanctionDetailFilters: isDetailOpen ? sanctionDetailFilters : undefined,
  });

  const handleApplyFilters = useCallback(
    (values: SanctionsFilterFormValues) => {
      setAppliedFilters(values);
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setAppliedFilters({
      sanction_type: "all",
      sanction_status: "all",
    });
    setPageNumber(1);
  }, []);

  const handleViewDetail = useCallback((row: SanctionDto) => {
    setSelectedSanction(row);
    setIsDetailOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {(GetSanctions.isLoading || GetSanctions.isFetching) && (
        <Loader title="Cargando sanciones disciplinarias..." />
      )}

      <SanctionsFilters
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <SanctionsTable
        data={GetSanctions.data?.data ?? []}
        onViewDetail={handleViewDetail}
        pagination={
          <Pagination
            currentPage={GetSanctions.data?.page_number ?? pageNumber}
            pageSize={GetSanctions.data?.page_size ?? PAGE_SIZE}
            totalRecords={GetSanctions.data?.total ?? 0}
            onPageChange={handlePageChange}
            disabled={GetSanctions.isFetching}
          />
        }
      />

      <SanctionDetailsModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSanction(null);
        }}
        summary={selectedSanction}
        detail={GetSanctionDetails.data}
        isDetailLoading={
          GetSanctionDetails.isLoading || GetSanctionDetails.isFetching
        }
      />
    </div>
  );
};
