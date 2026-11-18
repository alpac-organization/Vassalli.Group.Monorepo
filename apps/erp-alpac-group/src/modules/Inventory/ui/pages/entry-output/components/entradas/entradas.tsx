import { useCallback, useState } from "react";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";
import { EntradasSectionFilters } from "./components/entradas-section-filters/entradas-section-filters";
import { EntradasDetailModal } from "./components/entradas-detail-modal/entradas-detail-modal";
import { DEFAULT_ENTRADAS_FILTERS } from "./entradas.types";
import { GetInventoryEntriesColumnsToTable } from "./entradas.variants";

import type { EntradasFilters } from "./entradas.types";
import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

export const Entradas = function () {
   const { companyId, moduleCode } = useUserStore();
   const [filters, setFilters] = useState<EntradasFilters>(DEFAULT_ENTRADAS_FILTERS);
   const [selectedEntry, setSelectedEntry] = useState<InventoryEntry | null>(null);

   const { GetInventoryEntriesQuery } = useInventoryEntries({
      payloadGetInventoryEntriesRequest: {
         company_id: companyId,
         module_code: moduleCode,
         ...filters,
         page_number: filters.page_number ?? 1,
         page_size: filters.page_size ?? 10,
      },
   });

   const { data, isPending, isFetching } = GetInventoryEntriesQuery;

   const columns = GetInventoryEntriesColumnsToTable({
      ActionsMenuContext: {
         onViewEntry: setSelectedEntry,
      },
   });

   const handleApplyFilters = (newFilters: EntradasFilters) => {
      setFilters({ ...newFilters, page_number: 1 });
   };

   const handleClearFilters = () => {
      setFilters(DEFAULT_ENTRADAS_FILTERS);
   };

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({
         ...prev,
         page_number: page,
      }));
   }, []);

   return (
      <div className="flex flex-col gap-5 bg-transparent">
         <SectionHeader
            title="Filtros de búsqueda"
            subtitle="Utiliza los filtros de búsqueda para una búsqueda más rápida."
         />

         <EntradasSectionFilters
            filters={filters}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
         />

         <DataTable
            isLoading={isPending || isFetching}
            title="Entradas de inventario"
            data={data?.data ?? []}
            columns={columns}
            pagination={
               <Pagination
                  pageSize={data?.page_size ?? 0}
                  totalRecords={data?.total ?? 0}
                  currentPage={data?.page_number ?? 0}
                  onPageChange={handlePageChange}
               />
            }
         />
         
         <EntradasDetailModal
            isOpen={Boolean(selectedEntry)}
            onClose={() => setSelectedEntry(null)}
            entry={selectedEntry}
         />
      </div>
   );
};
