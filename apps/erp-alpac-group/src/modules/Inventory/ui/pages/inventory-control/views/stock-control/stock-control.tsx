import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useInventoryStocks } from "../../../../hooks/useInventoryStocks";
import { StockControlSectionFilters } from "./views/stock-control-section-filters/stock-control-section-filters";
import { DEFAULT_STOCK_FILTERS, GetInventoryStocksColumnsToTable } from "./stock-control.variants";
import { EditStockModal } from "./components/edit-stock-modal/edit-stock-modal";

import type { StockControlFilters } from "./stock-control.types";
import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";

const SEARCH_DEBOUNCE_MS = 5000;

export const StockControl = function(){
   //Consumir el endpoint para obtener existencias de productos en inventarios con su codigo.
   const { moduleCode, companyId } = useUserStore();

   const [searchText, setSearchText] = useState("");
   const [stockSelected, setStockSelected] = useState<InventoryStockData | null>(null);

   const [modalActions, setModalActions] = useState({
      openEditStockModal: false
   });

   const [filters, setFilters] = useState<StockControlFilters>(DEFAULT_STOCK_FILTERS);

   const { GetInventoryStocksQuery } = useInventoryStocks({
      payloadGetInventoryStocksRequest: {
         company_id: companyId,
         module_code: moduleCode,
         ...filters
      }
   });

   useEffect(() => {
      const text = searchText.trim();
      if (!text) return;

      const timer = setTimeout(() => {
         setFilters((prev) => ({
            ...prev,
            product_code: text,
            page_number: 1,
         }));
      }, SEARCH_DEBOUNCE_MS);

      return () => clearTimeout(timer);
   }, [searchText]);

   //Metodos de filtrado
   const handleClearFilters = () => {
      setSearchText("");
      setFilters(DEFAULT_STOCK_FILTERS);
   };

   const handleApplyFilters = (newFilters: StockControlFilters) => {
      setFilters({ ...newFilters, page_number: 1 });
   };

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({
         ...prev,
         page_number: page,
      }));
   }, []);

   //Metodos de modales
   const handleOpenEditStockModal = useCallback((stock: InventoryStockData) => {
      setStockSelected(stock);
      setModalActions((options) => ({ ...options, openEditStockModal: true }));
   }, []);

   const handleCloseEditStockModal = useCallback(() => {
      setModalActions((options) => ({ ...options, openEditStockModal: false }));
      setStockSelected(null);
   }, []);

   const { data: inventoryStocksData, isPending, isFetching } = GetInventoryStocksQuery;

   const columnsStocks = GetInventoryStocksColumnsToTable({
      ActionsMenuContext: {
         onEditStock: handleOpenEditStockModal
      }
   });

   return (
      <div className="flex flex-col gap-5 bg-transparent">
         {/* Resumen de información */}

         {/* Filtros de busquedas */}
         <SectionHeader
            title="Filtros de búsqueda"
            subtitle="Utiliza los filtros de busquedas para una busqueda mas rapida."
         />

         <StockControlSectionFilters
            filters={filters}
            onClear={handleClearFilters}
            onApply={handleApplyFilters}
         />

         {/* Información de stocks  */}
         <DataTable
            isLoading={isPending || isFetching}
            title="Existencias y niveles de stock"
            data={inventoryStocksData?.data ?? []}
            columns={columnsStocks}
            pagination={
               <Pagination
                  pageSize={inventoryStocksData?.page_size ?? 0}
                  totalRecords={inventoryStocksData?.total ?? 0}
                  currentPage={inventoryStocksData?.page_number ?? 0}
                  onPageChange={handlePageChange}
               />
            }
         />

         {/* Modales */}
         {
            modalActions.openEditStockModal && (
               <EditStockModal
                  stockSelected={stockSelected}
                  isOpen={modalActions.openEditStockModal}
                  onClose={handleCloseEditStockModal}
               />
            )
         }
      </div>
   )
}