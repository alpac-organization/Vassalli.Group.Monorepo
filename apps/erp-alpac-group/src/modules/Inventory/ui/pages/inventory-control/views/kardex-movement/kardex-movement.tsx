import { useCallback, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system"
import { useKardexMovements } from "@app/modules/Inventory/ui/hooks/useKardexMovements";
import { DEFAULT_KARDEX_MOVEMENT_FILTERS, GetKardexMovementsColumnsToTable } from "./kardex-movement.variants";
import { KardexMovementSectionFilters } from "./views/kardex-movement-section-filters/kardex-movement-section-filters";

import type { KardexMovementFilters } from "./kardex-movements.types";

export const KardexMovement = function(){

   const { companyId, moduleCode } = useUserStore();

   const [filters, setFilters] = useState<KardexMovementFilters>(DEFAULT_KARDEX_MOVEMENT_FILTERS);

   const { GetKardexMovementsQuery } = useKardexMovements({
      payloadGetKardexMovementsRequest: {
         company_id:  companyId,
         module_code: moduleCode,
         ...filters
      }
   });

   const handleApplyFilters = (newFilters: KardexMovementFilters) => {
      setFilters({ ...newFilters, page_number: 1 });
   };

   const handleClearFilters = () => {
      setFilters(DEFAULT_KARDEX_MOVEMENT_FILTERS);
   };

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
         {/* Filtros de busquedas */}
         <SectionHeader
            title="Filtros de búsqueda"
            subtitle="Utiliza los filtros de busquedas para una busqueda mas rapida."
         />

         <KardexMovementSectionFilters 
            filters={filters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
         />

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