import { DataTable, Pagination } from "@alpac/design-system";
import { useCallback, useMemo, useState } from "react";
import type { MovementQueueItem } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import { getMovementsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-columns";
import { MovementDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/movement-detail-modal";

type MovementsQueueProps = {
  data: MovementQueueItem[];
  onDetailClick?: (item: MovementQueueItem) => void;
};

export function MovementsQueue({ data, onDetailClick }: MovementsQueueProps) {
  const [selectedMovement, setSelectedMovement] =
    useState<MovementQueueItem | null>(null);

  const handleDetailClick = useCallback(
    (item: MovementQueueItem) => {
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
              currentPage={1}
              totalRecords={data.length}
              pageSize={10}
              onPageChange={() => {}}
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
