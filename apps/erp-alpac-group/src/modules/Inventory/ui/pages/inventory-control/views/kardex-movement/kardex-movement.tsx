import { DataTable, Pagination } from "@alpac/design-system"
import { useKardexMovements } from "@app/modules/Inventory/ui/hooks/useKardexMovements";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useState } from "react";
import type { KardexMovementFilters } from "./kardex-movements.types";
import { GetKardexMovementsColumnsToTable } from "./kardex-movement.variants";

export const KardexMovement = function(){

   const { companyId, moduleCode } = useUserStore();

   const [filters, setFilters] = useState<KardexMovementFilters>();

   const { GetKardexMovementsQuery } = useKardexMovements({
      payloadGetKardexMovementsRequest: {
         company_id:  companyId,
         module_code: moduleCode,
         ...filters
      }
   });

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({
         ...prev,
         page_number: page,
      }));
   }, []);

   const { data: KardexData, isLoading, isFetching } = GetKardexMovementsQuery;
   
   const columns = GetKardexMovementsColumnsToTable();

   return (
      <div className="flex flex-col gap-5">
         {/* Seccion de filtros del kardex */}



         {/* Información de los movimientos de kardex */}
         <DataTable 
				title="Movimientos Kardex"
				data={KardexData?.data ?? []}
            isLoading={isLoading || isFetching}
				columns={columns}
				pagination={
					<Pagination
                  pageSize={KardexData?.page_size ?? 5}
                  totalRecords={KardexData?.total ?? 0}
                  currentPage={KardexData?.page_number ?? 1}
						onPageChange={handlePageChange}
					/>
				}
			/>
      </div>
   )
}