import { useCallback, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";
import { toApiDate } from "@app/shared/utils/date.utils";
import { useKardexMovements } from "@app/modules/Inventory/ui/hooks/useKardexMovements";
import {
   DEFAULT_KARDEX_MOVEMENT_FILTERS,
   getKardexMovementsColumnsToTable,
} from "./kardex-movement.variants";
import { KardexMovementSectionFilters } from "./views/kardex-movement-section-filters/kardex-movement-section-filters";
import { KardexDetailModal } from "./components/kardex-detail-modal/kardex-detail-modal";

import type { KardexMovementFilters } from "./kardex-movements.types";
import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

export const KardexMovement = function () {
   const { companyId, moduleCode } = useUserStore();

   const [filters, setFilters] = useState<KardexMovementFilters>(
      DEFAULT_KARDEX_MOVEMENT_FILTERS,
   );
   const [selectedMovement, setSelectedMovement] =
      useState<KardexMovementsData | null>(null);

   const { GetKardexMovementsQuery } = useKardexMovements({
      payloadGetKardexMovementsRequest: {
         company_id: companyId,
         module_code: moduleCode,
         ...filters,
         date_from: toApiDate(filters.date_from) ?? undefined,
         date_to: toApiDate(filters.date_to) ?? undefined,
      },
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

   const columns = getKardexMovementsColumnsToTable({
      onViewDetail: setSelectedMovement,
   });

   return (
      <div className="flex flex-col gap-5">
         <SectionHeader
            title="Filtros de búsqueda"
            subtitle="Utiliza los filtros de búsqueda para localizar movimientos por sucursal, centro de costo, producto o periodo."
         />

         <KardexMovementSectionFilters
            filters={filters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
         />

         <DataTable
            title="Movimientos Kardex"
            data={KardexData?.data ?? []}
            isLoading={isLoading || isFetching}
            columns={columns}
            pagination={
               <Pagination
                  pageSize={KardexData?.page_size ?? 10}
                  totalRecords={KardexData?.total ?? 0}
                  currentPage={KardexData?.page_number ?? 1}
                  onPageChange={handlePageChange}
               />
            }
         />

         <KardexDetailModal
            key={selectedMovement?.kardex_id ?? "closed"}
            isOpen={Boolean(selectedMovement)}
            movement={selectedMovement}
            onClose={() => setSelectedMovement(null)}
         />
      </div>
   );
};
