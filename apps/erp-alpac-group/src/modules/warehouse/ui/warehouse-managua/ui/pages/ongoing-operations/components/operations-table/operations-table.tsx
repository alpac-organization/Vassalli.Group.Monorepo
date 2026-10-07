import { useMemo } from "react";
import { DataTable, Pagination } from "@alpac/design-system";
import type { OperationalOrderListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-orders-response";
import { getOperationsColumns } from "./operations-columns";

interface OperationsTableProps {
  data: OperationalOrderListItem[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onViewDetail: (order: OperationalOrderListItem) => void;
  onUpdateInfo: (order: OperationalOrderListItem) => void;
}

export function OperationsTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  onViewDetail,
  onUpdateInfo,
}: OperationsTableProps) {
  
  const columns = useMemo(
    () =>
      getOperationsColumns({
        onViewDetail,
        onUpdateInfo,
      }),
    [onViewDetail, onUpdateInfo],
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        title="Órdenes Operacionales"
        data={data}
        columns={columns}
        pagination={
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
          />
        }
      />
    </div>
  );
}
