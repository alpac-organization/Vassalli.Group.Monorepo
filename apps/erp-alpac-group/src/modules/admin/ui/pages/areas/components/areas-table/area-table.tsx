import { DataTable } from "@alpac/design-system";
import type { AreaTableProps } from "./types/area-table.types";
import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";

export function AreaTable({
  data,
  onDeleteClick,
  columns,
  pagination,
  deleteIcon,
  isLoading = false,
}: AreaTableProps) {
  return (
    <DataTable
      title="Listado de Áreas de Trabajo"
      onDelete={(row: GetAreasResponse) => onDeleteClick(row)}
      deleteIcon={deleteIcon}
      data={data}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
      loadingTitle="Cargando áreas de trabajo..."
      enableRowHover={false}
    />
  );
}
