import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getAssignmentsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignments-table/assignments-columns";
import type { AssignmentsTableProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignments-table/types/assignments-table.types";

export function AssignmentsTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onDetailClick,
  isFetching = false,
}: AssignmentsTableProps) {
  const lastItemId = data.at(-1)?.reception_id;
  const columns = useMemo(
    () => getAssignmentsColumns({ onDetailClick, lastItemId }),
    [onDetailClick, lastItemId],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Asignaciones de bodega"
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