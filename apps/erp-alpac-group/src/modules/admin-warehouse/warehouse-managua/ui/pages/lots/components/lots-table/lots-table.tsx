import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getTramosColumns } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/lots-columns";
import type { LotsTableProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/lots/components/lots-table/types/lots-table.types";
import type { LotDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-lot-res";

export function LotsTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  height,
  minHeight,
  maxHeight,
  isFetching = false,
  selectedLot,
  onPageChange,
  onViewDetail,
  onSelectRow,
}: LotsTableProps) {
  const lastItemId = data.at(-1)?.id;
  const columns = useMemo(
    () =>
      getTramosColumns({
        onViewDetail,
        lastItemId,
      }),
    [onViewDetail, lastItemId],
  );

  const handleRowClick = (row: LotDto) => {
    onSelectRow?.(row);
  };

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Lista de tramos"
        data={data}
        columns={columns}
        enableSelectBorder
        onRowClick={handleRowClick}
        selectedRowKey={selectedLot?.id ?? null}
        getRowKey={(row) => row.id}
        height={height}
        minHeight={minHeight}
        maxHeight={maxHeight}
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
