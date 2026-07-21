import { DataTable, Pagination } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import type { DataAccessControl } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { getMovementsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-columns";
import { MovementDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/movement-detail-modal";

type MovementsQueueProps = {
  data: DataAccessControl[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onDetailClick?: (item: DataAccessControl) => void;
};

export function MovementsQueue({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  isFetching = false,
  onDetailClick,
}: MovementsQueueProps) {
  const [selectedMovement, setSelectedMovement] =
    useState<DataAccessControl | null>(null);

  const handleDetailClick = useCallback(
    (item: DataAccessControl) => {
      setSelectedMovement(item);
      onDetailClick?.(item);
    },
    [onDetailClick],
  );

  const columns = useMemo(
    () => getMovementsColumns({ onDetailClick: handleDetailClick }),
    [handleDetailClick],
  );

  return (
    <>
      <div className="flex flex-col min-w-0 w-full overflow-x-auto">
        <DataTable
          title="Cola de Movimientos"
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

      <MovementDetailModal
        isOpen={Boolean(selectedMovement)}
        movement={selectedMovement}
        onClose={() => setSelectedMovement(null)}
      />
    </>
  );
}
