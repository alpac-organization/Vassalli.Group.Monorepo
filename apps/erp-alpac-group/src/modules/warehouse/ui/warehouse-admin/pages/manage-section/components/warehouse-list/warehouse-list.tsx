import { DataTable, Pagination } from "@alpac/design-system";
import { useCallback, useMemo } from "react";
import { getWarehouseColumns, type WarehouseRow } from "./warehouse-columns";

interface WarehouseListProps {
  data: WarehouseRow[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onViewSections: (warehouseId: string) => void;
}

export function WarehouseList({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  isFetching = false,
  onViewSections,
}: WarehouseListProps) {
  const handleViewSections = useCallback(
    (id: string) => {
      onViewSections(id);
    },
    [onViewSections],
  );

  const columns = useMemo(
    () =>
      getWarehouseColumns({
        onViewSections: handleViewSections,
        lastItemId: data.at(-1)?.warehouse_id,
      }),
    [data, handleViewSections],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Lista de bodegas"
        data={data}
        columns={columns}
        isLoading={isFetching}
        pagination={
          <Pagination
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={onPageChange}
            disabled={totalRecords === 0 || isFetching}
          />
        }
      />
    </div>
  );
}
