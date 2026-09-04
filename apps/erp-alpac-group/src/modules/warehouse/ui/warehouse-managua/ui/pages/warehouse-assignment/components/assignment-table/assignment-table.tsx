import { DataTable, Pagination } from "@alpac/design-system";
import { useCallback, useMemo } from "react";
import type { PendingAssignmentDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-pending-assignments";
import { getAssignmentColumns } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/components/assignment-table/assignment-columns";
import type { SelectedAssignmentTarget, AssignmentPageView } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/types/assignment.types";

type AssignmentTableProps = {
  view: AssignmentPageView;
  data: PendingAssignmentDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onAssignClick: (target: SelectedAssignmentTarget) => void;
  onDetailClick: (target: SelectedAssignmentTarget) => void;
};

export function AssignmentTable({
  view,
  data,
  currentPage,
  totalRecords,
  pageSize,
  isFetching = false,
  onPageChange,
  onAssignClick,
  onDetailClick,
}: AssignmentTableProps) {
  const handleAssignClick = useCallback(
    (target: SelectedAssignmentTarget) => onAssignClick(target),
    [onAssignClick],
  );

  const handleDetailClick = useCallback(
    (target: SelectedAssignmentTarget) => onDetailClick(target),
    [onDetailClick],
  );

  const columns = useMemo(
    () =>
      getAssignmentColumns({
        view,
        onAssignClick: handleAssignClick,
        onDetailClick: handleDetailClick,
        lastItemId: data.at(-1)?.reception_id,
      }),
    [view, data, handleAssignClick, handleDetailClick],
  );

  return (
    <div className="flex flex-col min-w-0 w-full overflow-x-auto">
      <DataTable
        title="Recepciones Pendientes de Asignación"
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

