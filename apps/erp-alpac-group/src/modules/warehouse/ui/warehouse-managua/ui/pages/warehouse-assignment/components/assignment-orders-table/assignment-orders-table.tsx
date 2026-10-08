import { useMemo } from "react";
import { DataTable, Pagination } from "@alpac/design-system";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { getAssignmentOrdersColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-orders-table/assignment-orders-columns";

interface AssignmentOrdersTableProps {
  data: OperationalOrderListItem[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onViewAssignments: (order: OperationalOrderListItem) => void;
  onViewOrderDetail?: (order: OperationalOrderListItem) => void;
}

export function AssignmentOrdersTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  isFetching,
  onPageChange,
  onViewAssignments,
  onViewOrderDetail,
}: AssignmentOrdersTableProps) {
  const columns = useMemo(
    () =>
      getAssignmentOrdersColumns({
        onViewAssignments,
        onViewOrderDetail,
      }),
    [onViewAssignments, onViewOrderDetail],
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        title="Órdenes Operacionales para Asignación"
        data={data}
        columns={columns}
        pagination={
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            disabled={isFetching}
          />
        }
      />
    </div>
  );
}
