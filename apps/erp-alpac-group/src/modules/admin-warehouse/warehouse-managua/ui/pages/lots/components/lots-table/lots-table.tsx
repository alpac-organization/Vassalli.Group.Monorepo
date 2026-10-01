import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getTramosColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/lots-columns";
import type { LotsTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/types/lots-table.types";

export function LotsTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onViewDetail,
  isFetching = false,
  capacitiesByLotId = {},
  capacitiesLoading = false,
}: LotsTableProps) {
  const lastItemId = data.at(-1)?.id;
  const columns = useMemo(
    () =>
      getTramosColumns({
        onViewDetail,
        lastItemId,
        capacitiesByLotId,
        capacitiesLoading,
      }),
    [onViewDetail, lastItemId, capacitiesByLotId, capacitiesLoading],
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
            disabled={isFetching}
          />
        }
      />
    </div>
  );
}
