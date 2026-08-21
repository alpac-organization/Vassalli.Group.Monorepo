import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Button } from "@alpac/design-system";
import { Rows3 } from "lucide-react";
import { useParams } from "react-router-dom";
import { TramosHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-header/tramos-header";
import { TramosFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-filters/tramos-filters";
import { TramosTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-table/tramos-table";
import { LotModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-modal/lot-modal";
import { LotDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/lot-detail-modal/lot-detail-modal";
import {
  EMPTY_TRAMO_FILTERS,
  type TramoFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/types/tramos.types";
import { filterTramos } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/utils/filter-tramos";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";

const PAGE_SIZE = 10;

export function TramosPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { alertState, handleCloseAlert, handleRequestError } = useAlertState();
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<TramoFilters>(
    EMPTY_TRAMO_FILTERS,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const getLotsPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
    }),
    [companyId, moduleCode, sectionId],
  );

  const getLotDetailPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      section_id: sectionId,
      lot_id: selectedLotId ?? "",
    }),
    [companyId, moduleCode, sectionId, selectedLotId],
  );

  const { GetLots, GetLotById } = useWarehouseAdmin({
    getLotsPayload,
    getLotDetailPayload,
  });

  const tramosData = useMemo(
    () => filterTramos(GetLots.data ?? [], appliedFilters),
    [GetLots.data, appliedFilters],
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tramosData.slice(start, start + PAGE_SIZE);
  }, [tramosData, currentPage]);

  useEffect(() => {
    if (!GetLots.isError || !GetLots.error) return;
    const mappedError = getMappedError(GetLots.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetLots.isError, GetLots.error, getMappedError, handleRequestError]);

  const handleApplyFilters = useCallback((filters: TramoFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_TRAMO_FILTERS);
    setCurrentPage(1);
  }, []);

  const handleViewDetail = useCallback((lot: LotListItemResponse) => {
    setSelectedLotId(lot.lot_id);
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
      {(GetLots.isPending || (isDetailModalOpen && GetLotById.isPending)) && (
        <Loader title="Cargando tramos..." />
      )}

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>

      <TramosHeader warehouseId={warehouseId} sectionId={sectionId} />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre nuevos tramos
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <Button
            type="button"
            size="giant"
            label="Registrar Nuevos Tramos"
            icon={<Rows3 size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => setIsLotModalOpen(true)}
          />
        </div>
      </div>

      <TramosFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <TramosTable
        data={paginatedData}
        currentPage={currentPage}
        totalRecords={tramosData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewDetail={handleViewDetail}
        isFetching={GetLots.isFetching}
      />

      <LotModal
        isOpen={isLotModalOpen}
        sectionId={sectionId}
        onClose={() => setIsLotModalOpen(false)}
      />

      <LotDetailModal
        isOpen={isDetailModalOpen}
        lot={GetLotById.data ?? null}
        isLoading={GetLotById.isPending}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLotId(null);
        }}
      />
    </m.div>
  );
}
