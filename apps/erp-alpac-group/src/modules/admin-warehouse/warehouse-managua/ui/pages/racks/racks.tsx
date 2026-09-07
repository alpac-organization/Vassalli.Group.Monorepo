import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { Rows4 } from "lucide-react";
import { useParams } from "react-router-dom";
import { RacksHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-header/racks-header";
import { RacksFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/racks-filters";
import { RacksTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-table/racks-table";
import { RackModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-modal/rack-modal";
import { RackDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/rack-detail-modal/rack-detail-modal";
import {
  EMPTY_RACK_FILTERS,
  type RackFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/types/racks.types";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { RackListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-rack-res";
import type { GetRacksRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-racks";
import { filtersToGetRacksParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/utils/filter-racks";

const PAGE_SIZE = 10;

export function RacksPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [selectedRack, setSelectedRack] = useState<RackListItemResponse | null>(
    null,
  );
  const [isPositionsModalOpen, setIsPositionsModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<RackFilters>(EMPTY_RACK_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const getRacksPayload = useMemo<GetRacksRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      ...filtersToGetRacksParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, sectionId, appliedFilters, currentPage],
  );

  const { GetRacks } = useWarehouseAdmin({
    getRacksPayload,
  });

  const racksData = GetRacks.data?.data ?? [];
  const totalRecords = GetRacks.data?.total ?? 0;

  useEffect(() => {
    if (!GetRacks.isError || !GetRacks.error) return;
    const mappedError = getMappedError(GetRacks.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetRacks.isError, GetRacks.error, getMappedError, handleRequestError]);

  const handleApplyFilters = useCallback((filters: RackFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_RACK_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleViewPositions = useCallback((rack: RackListItemResponse) => {
    setSelectedRack(rack);
    setIsPositionsModalOpen(true);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {GetRacks.isPending && <Loader title="Cargando racks..." />}

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>

      <RacksHeader warehouseId={warehouseId} sectionId={sectionId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre nuevos racks
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <Button
            type="button"
            size="giant"
            label="Registrar Nuevos Racks"
            icon={<Rows4 size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => setIsRackModalOpen(true)}
          />
        </div>
      </div>

      <RacksFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <RacksTable
        data={racksData}
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewPositions={handleViewPositions}
        isFetching={GetRacks.isFetching}
      />

      <RackModal
        isOpen={isRackModalOpen}
        sectionId={sectionId}
        onClose={() => setIsRackModalOpen(false)}
      />

      <RackDetailModal
        isOpen={isPositionsModalOpen}
        rack={selectedRack}
        onClose={() => {
          setIsPositionsModalOpen(false);
          setSelectedRack(null);
        }}
      />
    </m.div>
  );
}
