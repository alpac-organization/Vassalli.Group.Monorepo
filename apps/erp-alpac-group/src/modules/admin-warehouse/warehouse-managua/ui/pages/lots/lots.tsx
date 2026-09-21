import { m } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@alpac/design-system";
import { Rows3 } from "lucide-react";
import { useParams } from "react-router-dom";
import { LotsHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-header/lots-header";
import { LotsFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-filters/lots-filters";
import { LotsTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/lots-table";
import { LotModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-modal/lot-modal";
import { LotDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/lot-detail-modal/lot-detail-modal";
import {
  EMPTY_LOT_FILTERS,
  type LotFilters,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/types/lots.types";
import { filtersToGetLotsParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/utils/filter-lots";
import { useWarehouseAdmin } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useWarehouseAdmin";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { LotListItemResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";
import type { GetLotsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/get-lots-req";

const PAGE_SIZE = 10;

export function TramosPage() {
  const { warehouseId = "", sectionId = "" } = useParams<{
    warehouseId: string;
    sectionId: string;
  }>();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const { AlertComponent, handleRequestError } = useAlertState();
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<LotFilters>(EMPTY_LOT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const getLotsPayload = useMemo<GetLotsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      warehouse_id: warehouseId,
      section_id: sectionId,
      ...filtersToGetLotsParams(appliedFilters),
      page_number: currentPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, warehouseId, sectionId, appliedFilters, currentPage],
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

  const tramosData = GetLots.data?.data ?? [];
  const totalRecords = GetLots.data?.total ?? 0;

  useEffect(() => {
    if (!GetLots.isError || !GetLots.error) return;
    const mappedError = getMappedError(GetLots.error as ApiErrorResponse);
    handleRequestError(mappedError.description);
  }, [GetLots.isError, GetLots.error, getMappedError, handleRequestError]);

  const handleApplyFilters = useCallback((filters: LotFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_LOT_FILTERS);
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
      {GetLots.isPending && <Loader title="Cargando tramos..." />}

      {AlertComponent}

      <LotsHeader warehouseId={warehouseId} sectionId={sectionId} />

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

      <LotsFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <LotsTable
        data={tramosData}
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewDetail={handleViewDetail}
        isFetching={GetLots.isFetching}
      />

      <LotModal
        isOpen={isLotModalOpen}
        warehouseId={warehouseId}
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
