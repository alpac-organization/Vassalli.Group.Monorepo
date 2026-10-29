import { useCallback, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useInventoryStocks } from "../../../../hooks/useInventoryStocks";
import { StockControlSectionFilters } from "./views/stock-control-section-filters";
import { DEFAULT_STOCK_FILTERS, GetInventoryStocksColumnsToTable } from "./stock-control.variants";
import type { StockControlFilters } from "./stock-control.types";

const PAGE_SIZE = 5;

export const StockControl = function(){
	//Consumir el endpoint para obtener existencias de productos en inventarios con su codigo.
	const { moduleCode, companyId } = useUserStore();

   const [filters, setFilters] = useState<StockControlFilters>(DEFAULT_STOCK_FILTERS);

	const { GetInventoryStocksQuery } = useInventoryStocks({
		payloadGetInventoryStocksRequest: {
			company_id: companyId,
			module_code: moduleCode,
         
         ...(filters.product_code && { product_code: filters.product_code }),
         ...(filters.category_id  && { category_id:  filters.category_id  }),

         page_size: PAGE_SIZE,
         page_number: 1
		}
	});

	const { data: inventoryStocksData, isPending, isFetching } = GetInventoryStocksQuery;
	const columnsStocks = GetInventoryStocksColumnsToTable();

   //Metodos de filtrado
   const handleApplyFilters = (newFilters: StockControlFilters) => {
      setFilters(newFilters);
   };

   const handleClearFilters = () => {
      setFilters(DEFAULT_STOCK_FILTERS);
   };

   const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	},[]);
   
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
		</div>
	)
}