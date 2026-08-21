import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getSectionsColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/sections-columns";
import type { SectionsTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/sections-table/types/sections-table.types";

export function SectionsTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onViewLots,
  onViewRacks,
  isFetching = false,
}: SectionsTableProps) {
  const lastItemId = data.at(-1)?.section_id;
  const columns = useMemo(
    () => getSectionsColumns({ onViewLots, onViewRacks, lastItemId }),
    [onViewLots, onViewRacks, lastItemId],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Lista de secciones"
        data={data}
        columns={columns}
        pagination={
          <Pagination
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={onPageChange}
            disabled={isFetching || totalRecords === 0}
          />
        }
      />
    </div>
  );
}
