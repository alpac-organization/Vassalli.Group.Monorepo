import { useCallback, useMemo, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { RoleEnum } from "@app/core/enums/role.enum";
import { Badges, DataTable, Pagination, SectionHeader } from "@alpac/design-system";
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
   const { companyId, moduleCode, role } = useUserStore();

   const isAdministrator = role === RoleEnum.ADMINISTRATOR;
   const canFilterByCostCenter =
      isAdministrator || role === RoleEnum.MANAGER;

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
         branch_id: isAdministrator ? filters.branch_id : undefined,
         cost_center_id: canFilterByCostCenter
            ? filters.cost_center_id
            : undefined,
         date_from: toApiDate(filters.date_from) ?? undefined,
         date_to: toApiDate(filters.date_to) ?? undefined,
      },
   });

   const handleApplyFilters = (newFilters: KardexMovementFilters) => {
      setFilters({
         ...newFilters,
         branch_id: isAdministrator ? newFilters.branch_id : undefined,
         cost_center_id: canFilterByCostCenter
            ? newFilters.cost_center_id
            : undefined,
         page_number: 1,
      });
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
   const rows = useMemo(() => KardexData?.data ?? [], [KardexData?.data]);

   const singleProductContext = useMemo(() => {
      if (rows.length === 0) return null;
      const uniqueIds = new Set(
         rows.map((row) => row.product_information?.product_id).filter(Boolean),
      );
      if (uniqueIds.size !== 1) return null;
      return rows[0];
   }, [rows]);

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

         {singleProductContext && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs dark:border-slate-600 dark:bg-[#272b34]">
               <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                     Línea:
                  </span>
                  <Badges
                     color="info"
                     className="border border-indigo-200 bg-indigo-100 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                     label={
                        singleProductContext.product_information
                           ?.category_information?.name ?? "—"
                     }
                  />
                  <span className="mx-1 text-slate-300 dark:text-slate-600">
                     |
                  </span>
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                     Producto:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                     {singleProductContext.product_information?.product_code?.toUpperCase()}{" "}
                     · {singleProductContext.product_information?.product_name}
                  </span>
               </div>

               {singleProductContext.unit_measure_information?.name && (
                  <Badges
                     color="info"
                     className="border border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                     label={`U/M: ${singleProductContext.unit_measure_information.name}`}
                  />
               )}
            </div>
         )}

         <DataTable
            title="Movimientos Kardex"
            data={rows}
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
