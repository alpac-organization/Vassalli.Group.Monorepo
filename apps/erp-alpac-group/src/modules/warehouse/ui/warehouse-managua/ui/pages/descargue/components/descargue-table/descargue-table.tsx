import { useMemo } from "react";
import { DataTable, Pagination } from "@alpac/design-system";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import { getDescargueColumns } from "./descargue-columns";

interface DescargueTableProps {
  data: AssignmentOperationalDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onStartDescargue: (assignment: AssignmentOperationalDto) => void;
  onFinishDescargue: (assignment: AssignmentOperationalDto) => void;
  onGoTo3D?: (assignment: AssignmentOperationalDto) => void;
}

export function DescargueTable({
  data,
  currentPage,
  totalRecords,
  pageSize,
  isFetching,
  onPageChange,
  onStartDescargue,
  onFinishDescargue,
  onGoTo3D,
}: DescargueTableProps) {
  const columns = useMemo(
    () =>
      getDescargueColumns({
        onStartDescargue,
        onFinishDescargue,
        onGoTo3D,
      }),
    [onStartDescargue, onFinishDescargue, onGoTo3D],
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        title="Mercancías en Proceso de Descargue"
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
