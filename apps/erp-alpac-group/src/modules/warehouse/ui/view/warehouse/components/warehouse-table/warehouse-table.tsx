import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getWarehouseColumns } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/warehouse-columns";
import type { WarehouseTableProps } from "@app/modules/warehouse/ui/view/warehouse/components/warehouse-table/types/warehouse-table.types";

export function WarehouseTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onViewSections,
  onAttachSubwarehouse,
  isFetching = false,
}: WarehouseTableProps) {
  const lastItemId = data.at(-1)?.warehouse_id;
  const columns = useMemo(
    () => getWarehouseColumns({ onViewSections, onAttachSubwarehouse, lastItemId }),
    [onViewSections, onAttachSubwarehouse, lastItemId],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Lista de bodegas"
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
