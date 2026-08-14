import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import { getPendingAssignmentsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/pending-assignments-table/pending-assignments-columns";
import type { PendingAssignmentsTableProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/pending-assignments-table/types/pending-assignments-table.types";

export function PendingAssignmentsTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onAssignClick,
  isFetching = false,
}: PendingAssignmentsTableProps) {
  const columns = useMemo(
    () => getPendingAssignmentsColumns({ onAssignClick }),
    [onAssignClick],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Documentos pendientes de asignación"
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