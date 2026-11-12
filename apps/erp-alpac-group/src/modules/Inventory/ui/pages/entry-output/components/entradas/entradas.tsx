import { useCallback, useState } from "react";
import { DataTable, Pagination, SectionHeader } from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useInventoryEntries } from "@app/modules/Inventory/ui/hooks/useInventoryEntries";

import type { TableColumn } from "@alpac/design-system";
import type { InventoryEntryData } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";

const GetInventoryEntriesColumnsToTable = (): TableColumn<InventoryEntryData>[] => [
   {
      key: "code",
      label: "Código",
      render: (item) => <span>{item.code ?? "—"}</span>,
   },
   {
      key: "entry_status",
      label: "Estado",
      render: (item) => <span>{String(item.entry_status)}</span>,
   },
   {
      key: "branch",
      label: "Sucursal",
      render: (item) => <span>{item.branch_information?.branch_name ?? "—"}</span>,
   },
];

export const Entradas = function () {
   const { companyId, moduleCode } = useUserStore();

   const [filters, setFilters] = useState({
      page_number: 1,
      page_size: 10,
   });

   const { GetInventoryEntriesQuery } = useInventoryEntries({
      payloadGetInventoryEntriesRequest: {
         company_id: companyId,
         module_code: moduleCode,
         ...filters,
      },
   });

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({ ...prev, page_number: page }));
   }, []);

   const { data, isPending, isFetching } = GetInventoryEntriesQuery;

   return (
      <div className="flex flex-col gap-5 bg-transparent">
         <SectionHeader
            title="Entradas de inventario"
            subtitle="Listado de entradas registradas."
         />

         <DataTable
            isLoading={isPending || isFetching}
            title="Entradas de inventario"
            data={data?.data ?? []}
            columns={GetInventoryEntriesColumnsToTable()}
            pagination={
               <Pagination
                  pageSize={data?.page_size ?? 0}
                  totalRecords={data?.total ?? 0}
                  currentPage={data?.page_number ?? 0}
                  onPageChange={handlePageChange}
               />
            }
         />
      </div>
   );
};