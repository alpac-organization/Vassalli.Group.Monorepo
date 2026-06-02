import { DataTable } from "@alpac/design-system";
import type { CostCenterTableProps } from "./cost-center-table.types";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";
export function CostCenterTable({
  data,
  onDelete,
  columns,
}: CostCenterTableProps) {
  const handleDelete = (costCenterId: string) => {
    onDelete(costCenterId);
  };
  return (
    <DataTable
      title="Listado de Centros de Costos"
      onDelete={(row: GetCostCentersResponse) =>
        handleDelete(row.cost_center_id)
      }
      data={data}
      columns={columns}
    />
  );
}
