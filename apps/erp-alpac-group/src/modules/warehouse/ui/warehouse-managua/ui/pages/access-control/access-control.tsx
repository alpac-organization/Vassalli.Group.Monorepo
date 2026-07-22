import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { DatePickerValue } from "@alpac/design-system";
import { AccessControlHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-header/access-control-header";
import { AccessControlStats } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-stats/access-control-stats";
import { AccessControlActions } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-actions/access-control-actions";
import { AccessControlFiltersBar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/access-control-filters";
import { MovementsQueue } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-queue";
import { GateEntryModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/gate-entry-modal";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import type { AccessControlFilters } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import { getAccessControlMetrics } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/filter-movements";
import { useAccessControl } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAccessControl";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import { Loader } from "@app/shared/components/loaders/loader";

const PAGE_SIZE = 10;

const EMPTY_FILTERS: AccessControlFilters = {
  ducat_number: "",
  plate_number: "",
  driver_name: "",
  date: null,
};

const toApiDate = (date: DatePickerValue | null): string => {
  if (!date) return "";
  return dayjs(date.$d ?? date).format("YYYY-MM-DD");
};

export function AccessControlPage() {
  const { companyId, moduleCode } = useUserStore();
  const queryClient = useQueryClient();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedFilters, setAppliedFilters] =
    useState<AccessControlFilters>(EMPTY_FILTERS);
  const [isGateEntryOpen, setIsGateEntryOpen] = useState(false);

  const payload = useMemo<GetAccessControlRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      driver_name: appliedFilters.driver_name.trim(),
      plate_number: appliedFilters.plate_number.trim(),
      ducat_number: appliedFilters.ducat_number.trim(),
      date: toApiDate(appliedFilters.date),
      page_number: pageNumber,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, appliedFilters, pageNumber],
  );

  const { GetAccessControl } = useAccessControl({ payload });
  const {
    data: accessControl,
    isLoading,
    isFetching,
  } = GetAccessControl;

  const movements = accessControl?.data ?? [];
  const totalRecords = accessControl?.total_count ?? 0;

  const metrics = useMemo(
    () => getAccessControlMetrics(movements, totalRecords),
    [movements, totalRecords],
  );

  const handleApplyFilters = useCallback((filters: AccessControlFilters) => {
    setAppliedFilters({
      ducat_number: filters.ducat_number.trim(),
      plate_number: filters.plate_number.trim(),
      driver_name: filters.driver_name.trim(),
      date: filters.date,
    });
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_FILTERS);
    setPageNumber(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleGateEntrySubmit = useCallback(
    (_data: GateEntryFormValues) => {
      void queryClient.invalidateQueries({ queryKey: ["access-control"] });
    },
    [queryClient],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {isLoading && <Loader title="Cargando control de acceso..." />}

      <AccessControlHeader />

      <AccessControlStats metrics={metrics} />

      <AccessControlActions onGiveEntry={() => setIsGateEntryOpen(true)} />

      <AccessControlFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <MovementsQueue
        data={movements}
        currentPage={accessControl?.page_number ?? pageNumber}
        totalRecords={totalRecords}
        pageSize={accessControl?.page_size ?? PAGE_SIZE}
        onPageChange={handlePageChange}
        isFetching={isFetching}
      />

      <GateEntryModal
        isOpen={isGateEntryOpen}
        onClose={() => setIsGateEntryOpen(false)}
        onSubmit={handleGateEntrySubmit}
      />
    </m.div>
  );
}
