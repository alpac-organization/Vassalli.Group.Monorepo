import { DataTable, Pagination } from "@alpac/design-system";
import { useMemo } from "react";
import type { PendingAssignmentDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-pending-assignments";
import type { SelectedAssignmentTarget } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";
import { getAssignmentColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-table/assignment-columns";

type AssignmentHistoryTableProps = {
  data: PendingAssignmentDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onDetailClick: (target: SelectedAssignmentTarget) => void;
};

export function AssignmentHistoryTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  isFetching = false,
  onPageChange,
  onDetailClick,
}: AssignmentHistoryTableProps) {
  // En el historial no se muestra "Asignar", sólo "Ver detalle"
  const columns = useMemo(
    () =>
      getAssignmentColumns({
        view: "history",
        onDetailClick,
        lastItemId: data.at(-1)?.reception_id,
      }),
    [data, onDetailClick],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Historial de Asignaciones"
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

