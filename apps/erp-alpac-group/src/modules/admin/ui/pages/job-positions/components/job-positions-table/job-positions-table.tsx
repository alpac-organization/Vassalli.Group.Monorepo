import { DataTable } from "@alpac/design-system";
import type { JobPositionsTableProps } from "@app/modules/admin/ui/pages/job-positions/components/job-positions-table/types/job-positions-table.types";
import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";

export function JobPositionsTable({
  data,
  onDeleteClick,
  columns,
  pagination,
  deleteIcon,
  isLoading = false,
}: JobPositionsTableProps) {
  return (
    <DataTable
      title="Listado de Puestos de Trabajo"
      onDelete={(row: GetJobPositionsResponse) => onDeleteClick(row)}
      deleteIcon={deleteIcon}
      data={data}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
      loadingTitle="Cargando puestos de trabajo..."
      enableRowHover={false}
    />
  );
}
