import { DataTable, Pagination } from "@alpac/design-system";
import { useCallback, useMemo } from "react";
import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { getMovementsColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-columns";
import type { MovementsQueueProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/types/movements-queues";

export function MovementsQueue({
  data,
  currentPage,
  totalRecords,
  pageSize,
  onPageChange,
  isFetching = false,
  onDetailClick,
  onExitClick,
}: MovementsQueueProps) {
  const handleDetailClick = useCallback(
    (item: ReceptionEntranceListItem) => {
      onDetailClick?.(item);
    },
    [onDetailClick],
  );

  const handleExitClick = useCallback(
    (item: ReceptionEntranceListItem) => {
      onExitClick?.(item);
    },
    [onExitClick],
  );

  const columns = useMemo(
    () =>
      getMovementsColumns({
        onDetailClick: handleDetailClick,
        onExitClick: handleExitClick,
        lastItemId: data.at(-1)?.id,
      }),
    [data, handleDetailClick, handleExitClick],
  );

  return (
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
  );
}
