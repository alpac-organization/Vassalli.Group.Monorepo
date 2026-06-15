import { DataTable } from "@alpac/design-system";
import type { CostCenterTableProps } from "@app/modules/admin/ui/pages/cost-centers/components/cost-centers-table/types/cost-center-table.types";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";

export function CostCenterTable({
  data,
  onDeleteClick,
  columns,
  deleteIcon,
  pagination,
  isLoading = false,
}: CostCenterTableProps) {
  return (
    <DataTable
      title="Listado de Centros de Costos"
      onDelete={(row: GetCostCentersResponse) => onDeleteClick(row)}
      data={data}
      columns={columns}
      deleteIcon={deleteIcon}
      pagination={pagination}
      isLoading={isLoading}
      loadingTitle="Cargando centros de costo..."
      enableRowHover={false}
    />
  );
}
