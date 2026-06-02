import { DataTable } from "@alpac/design-system";
import type { AreaTableProps } from "./area-table.types";
import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";

export function AreaTable({
  data,
  onDeleteClick,
  columns,
  pagination,
}: AreaTableProps) {
  return (
    <DataTable
      title="Listado de Áreas de Trabajo"
      onDelete={(row: GetAreasResponse) => onDeleteClick(row)}
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
}
