import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@alpac/design-system";
import { Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WarehouseHeader } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-header/warehouse-header";
import { WarehouseFiltersBar } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-filters/warehouse-filters";
import { WarehouseTable } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-table/warehouse-table";
import { WarehouseModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-modal/warehouse-modal";
import { useWarehouse } from "@app/modules/warehouse/ui/hooks/useWarehouse";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { Loader } from "@app/shared/components/loaders/loader";
import { filtersToGetWarehouseParams } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/utils/warehouse-utils";
import { EMPTY_WAREHOUSE_FILTERS, type WarehouseFilters } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/types/warehouse.types";
import { WarehouseDetailModal } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-detail-modal/warehouse-detail-modal";

import type { WarehouseDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/get-warehouses-response";
import type { GetWarehouseRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/get-warehouses-request";
import { WarehouseViewer } from "./components/warehouse-viewer/warehouse-viewer";

const PAGE_SIZE = 10;

export function WarehousePage() {
   const navigate = useNavigate();

   const { baseUrl } = useBaseUrl();
   const { companyId, moduleCode, moduleBasePath } = useUserStore();
   const isWarehouseAdmin = moduleBasePath.includes("warehouse-admin");
   const [appliedFilters, setAppliedFilters] = useState<WarehouseFilters>(EMPTY_WAREHOUSE_FILTERS);
   const [currentPage, setCurrentPage] = useState(1);
   const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
   const [isWarehouseDetailModalOpen, setIsWarehouseDetailModalOpen] = useState(false);
   const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseDto | null>();
   const [editingWarehouse, setEditingWarehouse] = useState<WarehouseDto | null>(null);

   const getWarehousesPayload = useMemo<GetWarehouseRequest>(
      () => ({
         company_id: companyId,
         module_code: moduleCode,
         ...filtersToGetWarehouseParams(appliedFilters),
         page_number: currentPage,
         page_size: PAGE_SIZE,
      }),
      [companyId, moduleCode, appliedFilters, currentPage],
   );

   const { GetWarehouses } = useWarehouse({
      getWarehousesPayload,
   });

   const warehouseData = GetWarehouses.data?.data ?? [];
   const totalRecords = GetWarehouses.data?.total ?? 0;

   const handleApplyFilters = useCallback((filters: WarehouseFilters) => {
      setAppliedFilters(filters);

      setCurrentPage(1);
   }, []);

   const handleClearFilters = useCallback(() => {
      setAppliedFilters(EMPTY_WAREHOUSE_FILTERS);
      setCurrentPage(1);
   }, []);

   const handleViewSections = useCallback(
      (warehouse: WarehouseDto) => {
         const sectionsPath = isWarehouseAdmin
            ? `${baseUrl}/warehouse-admin/management/sections/${warehouse.warehouse_id}`
            : `${baseUrl}/warehouse-mga/warehouse/${warehouse.warehouse_id}/sections`;

         navigate(sectionsPath);
      },

      [baseUrl, isWarehouseAdmin, navigate],
   );

   const handleCreateWarehouseClick = useCallback(() => {
      setEditingWarehouse(null);
      setIsWarehouseModalOpen(true);
   }, []);

   const handleCloseModal = useCallback(() => {
      setIsWarehouseModalOpen(false);
      setEditingWarehouse(null);
   }, []);

   const handleViewDetails = useCallback((warehouse: WarehouseDto) => {
      setSelectedWarehouse(warehouse);
      setIsWarehouseDetailModalOpen(true);
   }, []);

   const handleUpdateWarehouse = useCallback((warehouse: WarehouseDto) => {
      setSelectedWarehouse(warehouse);
      setEditingWarehouse(warehouse);
      setIsWarehouseModalOpen(true);
   }, []);

   const handleSelectRow = useCallback((warehouse: WarehouseDto) => {
      setSelectedWarehouse(warehouse);
   }, []);

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
                  onClick={handleCreateWarehouseClick}
               />
            </div>
         </div>

         <WarehouseFiltersBar
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
         />

         <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] min-h-0">

            <WarehouseTable
               data={warehouseData}
               currentPage={GetWarehouses.data?.page_number ?? currentPage}
               totalRecords={totalRecords}
               pageSize={GetWarehouses.data?.page_size ?? PAGE_SIZE}
               onPageChange={setCurrentPage}
               onViewSections={handleViewSections}
               onViewDetails={handleViewDetails}
               onUpdateWarehouse={handleUpdateWarehouse}
               onSelectRow={handleSelectRow}
               selectedWarehouse={selectedWarehouse}
               isFetching={GetWarehouses.isFetching}
            />

            <WarehouseViewer warehouse={selectedWarehouse} />

         </div>


         <WarehouseModal
            isOpen={isWarehouseModalOpen}
            warehouse={editingWarehouse}
            onClose={handleCloseModal}
         />

         <WarehouseDetailModal
            warehouse={selectedWarehouse}
            isOpen={isWarehouseDetailModalOpen}
            onClose={() => setIsWarehouseDetailModalOpen(false)}
         />
      </m.div>
   );
}
