import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getTramosColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-table/tramos-columns";
import type { TramosTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/tramos/components/tramos-table/types/tramos-table.types";

export function TramosTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onViewDetail,
  isFetching = false,
}: TramosTableProps) {
  const lastItemId = data.at(-1)?.lot_id;
  const columns = useMemo(
    () => getTramosColumns({ onViewDetail, lastItemId }),
    [onViewDetail, lastItemId],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Lista de tramos"
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
