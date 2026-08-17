import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { Rows4 } from "lucide-react";
import { useParams } from "react-router-dom";
import { RacksHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-header/racks-header";
import { RacksFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-filters/racks-filters";
import { RacksTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-table/racks-table";
import { RackModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/rack-modal";
import { RackDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/rack-detail-modal";
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
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<RackFilters>(
    EMPTY_RACK_FILTERS,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { GetRacks, GetRackById } = useWarehouseAdmin({
    getRacksPayload: {
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      level_number: appliedFilters.level ? Number(appliedFilters.level) : null,
      status: appliedFilters.status || null,
      usage_profile: appliedFilters.usage || null,
    },
    getRackDetailPayload: {
      company_id: companyId,
      module_code: moduleCode,
      rack_id: selectedRackId ?? "",
    },
  });

  const racksData = GetRacks.data?.racks ?? [];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return racksData.slice(start, start + PAGE_SIZE);
  }, [racksData, currentPage]);

  useEffect(() => {
    if (!GetRacks.isError || !GetRacks.error) return;
    const mappedError = getMappedError(GetRacks.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetRacks.isError, GetRacks.error, getMappedError, handleRequestError]);

  useEffect(() => {
    if (!GetRackById.isError || !GetRackById.error) return;
    const mappedError = getMappedError(GetRackById.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [
    GetRackById.isError,
    GetRackById.error,
    getMappedError,
    handleRequestError,
  ]);

  const handleApplyFilters = useCallback((filters: RackFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_RACK_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleViewDetail = useCallback((rack: RackListItemResponse) => {
    setSelectedRackId(rack.rack_id);
    setIsDetailModalOpen(true);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {(GetRacks.isPending || (isDetailModalOpen && GetRackById.isPending)) && (
        <Loader title="Cargando racks..." />
      )}

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
        data={paginatedData}
        currentPage={currentPage}
        totalRecords={racksData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewDetail={handleViewDetail}
        isFetching={GetRacks.isFetching}
      />

      <RackModal
        isOpen={isRackModalOpen}
        sectionId={sectionId}
        onClose={() => setIsRackModalOpen(false)}
      />

      <RackDetailModal
        isOpen={isDetailModalOpen}
        rack={GetRackById.data ?? null}
        isLoading={GetRackById.isPending}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRackId(null);
        }}
      />
    </m.div>
  );
}
