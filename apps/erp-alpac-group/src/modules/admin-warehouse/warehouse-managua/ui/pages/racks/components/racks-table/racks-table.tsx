import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getRacksColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-table/racks-columns";
import type { RacksTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/racks/components/racks-table/types/racks-table.types";

export function RacksTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onViewDetail,
  isFetching = false,
}: RacksTableProps) {
  const lastItemId = data.at(-1)?.rack_id;
  const columns = useMemo(
    () => getRacksColumns({ onViewDetail, lastItemId }),
    [onViewDetail, lastItemId],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Lista de racks"
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
