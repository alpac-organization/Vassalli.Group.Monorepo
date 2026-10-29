import { DataTable, Pagination } from "@alpac/design-system"

export const KardexMovement = function(){
   return (
      <div>
         <DataTable 
				title="Movimientos Kardex"
				data={[]}
				columns={[]}
				pagination={
					<Pagination
						pageSize={0}
						totalRecords={0}
						currentPage={0}
						onPageChange={() => {}}
					/>
				}
			/>
      </div>
   )
}