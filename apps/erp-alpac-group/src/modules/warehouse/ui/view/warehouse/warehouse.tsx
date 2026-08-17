import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@alpac/design-system";
import { Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WarehouseHeader } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-header/warehouse-header";
import { WarehouseFiltersBar } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-filters/warehouse-filters";
import { WarehouseTable } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/warehouse-table";
import { WarehouseModal } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-modal/warehouse-modal";
import {
  EMPTY_WAREHOUSE_FILTERS,
  type WarehouseFilters,
} from "@app/modules/warehouse/ui/view/warehouse/types/warehouse.types";
import {
  filterWarehouses,
  normalizeWarehouses,
} from "@app/modules/warehouse/ui/view/warehouse/utils/map-warehouses";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { Loader } from "@app/shared/components/loaders/loader";
import type { GetWarehousesResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses";

const PAGE_SIZE = 10;

export function WarehousePage() {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { companyId, moduleCode } = useUserStore();
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<WarehouseFilters>(
    EMPTY_WAREHOUSE_FILTERS,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { GetWarehouses } = useWarehouse({
    getWarehousesPayload: {
      company_id: companyId,
      module_code: moduleCode,
    },
  });

  const warehouseData = useMemo(
    () =>
      filterWarehouses(normalizeWarehouses(GetWarehouses.data), appliedFilters),
    [GetWarehouses.data, appliedFilters],
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return warehouseData.slice(start, start + PAGE_SIZE);
  }, [warehouseData, currentPage]);

  const handleApplyFilters = useCallback((filters: WarehouseFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
  }, []);
  const handleClearFilters = useCallback(() => {
    setAppliedFilters(EMPTY_WAREHOUSE_FILTERS);
    setCurrentPage(1);
  }, []);
  const handleViewSections = useCallback(
    (warehouse: GetWarehousesResponse) => {
      navigate(
        `${baseUrl}/warehouse-mga/warehouse/${warehouse.warehouse_id}/sections`,
      );
    },
    [baseUrl, navigate],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {GetWarehouses.isPending && <Loader title="Cargando bodegas..." />}

      <WarehouseHeader />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Acciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Registre una nueva bodega
            </small>
          </div>
        </div>

        <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
          <Button
            type="button"
            size="giant"
            label="Registrar Nueva Bodega"
            icon={<Warehouse size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => setIsWarehouseModalOpen(true)}
          />
        </div>
      </div>

      <WarehouseFiltersBar
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <WarehouseTable
        data={paginatedData}
        currentPage={currentPage}
        totalRecords={warehouseData.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onViewSections={handleViewSections}
        isFetching={GetWarehouses.isFetching}
      />

      <WarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
      />
    </m.div>
  );
}
