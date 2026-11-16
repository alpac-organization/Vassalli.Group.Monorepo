import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { EditStockModal } from "./components/edit-stock-modal/edit-stock-modal";
import { StockControlSectionCards } from "./views/stock-control-cards/stock-control-section-cards";

import { useInventoryStocks } from "../../../../hooks/useInventoryStocks";
import { StockControlSectionFilters } from "./views/stock-control-section-filters/stock-control-section-filters";
import { DEFAULT_STOCK_FILTERS, GetInventoryStocksColumnsToTable } from "./stock-control.variants";

import { DeleteProducModal } from "./components/delete-stock-modal/delete-product-modal";

import type { StockControlFilters, StockModalActions } from "./stock-control.types";
import type { InventoryStockData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-stocks.response";
import { useAlertState } from "@app/shared/hooks/useAlertState";

const SEARCH_DEBOUNCE_MS = 5000;

export const StockControl = function(){
   const { moduleCode, companyId } = useUserStore();
   const { AlertComponent, handleRequestError, handleRequestSuccess } = useAlertState();

   const [searchText, setSearchText] = useState("");
   const [stockSelected, setStockSelected] = useState<InventoryStockData | null>(null);

   const [modalActions, setModalActions] = useState<StockModalActions>({
      openEditStockModal:   false,
      openDeleteStockModal: false
   });

   const [filters, setFilters] = useState<StockControlFilters>(DEFAULT_STOCK_FILTERS);

   const handleOpenEditStockModal = useCallback((stock: InventoryStockData) => {
      setStockSelected(stock);
      setModalActions(prev => ({ ...prev, openEditStockModal: true }));
   }, []);

   const handleOpenDeleteStockModal = useCallback((stock: InventoryStockData) => {
      setStockSelected(stock);
      setModalActions(prev => ({ ...prev, openDeleteStockModal: true }));
   }, []);

   //#region Cerrado de modales...
   const handleCloseEditStockModal = () => {
      setModalActions(prev => ({ ...prev, openEditStockModal: false }));
      setStockSelected(null);
   };

   const handleCloseDeleteStockModal = () => {
      setModalActions(prev => ({ ...prev, openDeleteStockModal: false }));
      setStockSelected(null);
   };
   //#endregion

   const { GetInventoryStocksQuery } = useInventoryStocks({
      payloadGetInventoryStocksRequest: {
         company_id:  companyId,
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
   
   //#region Manejadores de filtros
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
   //#endregion

   const { data: inventoryStocksData, isPending, isFetching } = GetInventoryStocksQuery;

   const columnsStocks = GetInventoryStocksColumnsToTable({
      ActionsMenuContext: {
         onEditStock:            handleOpenEditStockModal,
         onDeleteInventoryStock: handleOpenDeleteStockModal
      }
   });

   return (
      <div className="flex flex-col gap-5 bg-transparent">

         {/* Resumen de información */}
         <SectionHeader
            title="Resumen de existencias"
            subtitle="Estado actual de los niveles de stock"
         />

         <StockControlSectionCards
            data={inventoryStocksData}
         /> 

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

         {
            modalActions.openDeleteStockModal && (
               <DeleteProducModal
                  stockSelected={stockSelected}
                  handleRequestError={handleRequestError}
                  handleRequestSuccess={handleRequestSuccess}
                  isOpen={modalActions.openDeleteStockModal}
                  onClose={handleCloseDeleteStockModal}
               />
            )
         }

         { AlertComponent }

      </div>
   )
}