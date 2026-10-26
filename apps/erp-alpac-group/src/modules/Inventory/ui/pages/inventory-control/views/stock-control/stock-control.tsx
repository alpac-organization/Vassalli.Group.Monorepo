import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useInventoryStocks } from "../../../../hooks/useInventoryStocks";
import { StockControlSectionFilters } from "./views/stock-control-section-filters";
import { GetInventoryStocksColumnsToTable } from "./stock-control.variants";

export const StockControl = function(){

	//Consumir el endpoint para obtener existencias de productos en inventarios con su codigo.
	const { moduleCode, companyId } = useUserStore();

	const { GetInventoryStocksQuery } = useInventoryStocks({
		payloadGetInventoryStocksRequest: {
			company_id: companyId,
			module_code: moduleCode
		}
	});

	const { data: inventoryStocksData } = GetInventoryStocksQuery;

	console.log(JSON.stringify(inventoryStocksData, null, 3));
	
	//Configuraciones de columas de tablas.
	const columnsStocks = GetInventoryStocksColumnsToTable();
	
	return (
		<div className="flex flex-col gap-5 bg-transparent">
			
			{
				GetInventoryStocksQuery.isPending && (
					<Loader title="Cargado información de inventario" />
				)
			}

			{/* Resumen de información */}


			{/* Filtros de busquedas */}
			<SectionHeader
				title="Filtros de búsqueda"
				subtitle="Utiliza los filtros de busquedas para una busqueda mas rapida."
			/>

			<StockControlSectionFilters />

			{/* Información de stocks  */}

			<DataTable 
				title="Existencias y niveles de stock"
				data={inventoryStocksData?.data ?? []}
				columns={columnsStocks}
				pagination={
					<Pagination
						pageSize={inventoryStocksData?.page_size ?? 0}
						totalRecords={inventoryStocksData?.total ?? 0}
						currentPage={inventoryStocksData?.page_number ?? 0}
						onPageChange={() => {}}
					/>
				}
			/>
		</div>
	)
}