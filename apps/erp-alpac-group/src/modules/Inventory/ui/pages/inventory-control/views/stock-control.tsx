import { DataTable, Pagination, SectionHeader } from "@alpac/design-system"
import { useUserStore } from "@app/shared/stores/useUserStore"

export const StockControl = function(){
	//Consumir el endpoint para obtener existencias de productos en inventarios con su codigo.

	const { } = useUserStore();

	return (
		<div className="flex flex-col gap-5">
			{/* Resumen de información */}


			{/* Información de stocks  */}
			<DataTable 
				title="Existencias y niveles de stock"
				data={[]}
				columns={[]}
				pagination={
					<Pagination
						pageSize={10}
						currentPage={1}
						totalRecords={10}
						onPageChange={() => {}}
					/>
				}
			/>

			<SectionHeader 
				title="Ultimos movimientos"
				subtitle="Ultimos movimientos de inventarios realizados actualmente"
			/>

			<DataTable 
				title="Entradas y salidas"
				data={[]}
				columns={[]}
			/>
		</div>
	)
}