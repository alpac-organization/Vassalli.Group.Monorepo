import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getMerchandiseColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/merchandise-columns";
import type { MerchandiseTableProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/merchandise/components/merchandise-table/types/merchandise-table.types";

export function MerchandiseTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onDetailClick,
  isFetching = false,
}: MerchandiseTableProps) {
  const lastItemId = data.at(-1)?.id;
  const columns = useMemo(
    () => getMerchandiseColumns({ onDetailClick, lastItemId }),
    [onDetailClick, lastItemId],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Registro de Mercancía"
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
