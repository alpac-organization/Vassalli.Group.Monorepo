import { DataTable } from "@alpac/design-system";
import { useMemo } from "react";
import type { MovementQueueItem } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import { getMovementsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-columns";
import { Pagination } from "@alpac/design-system";

type MovementsQueueProps = {
  data: MovementQueueItem[];
  onDetailClick?: (item: MovementQueueItem) => void;
};

export function MovementsQueue({ data, onDetailClick }: MovementsQueueProps) {
  const columns = useMemo(
    () => getMovementsColumns({ onDetailClick }),
    [onDetailClick],
  );

  return (
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
  );
}
