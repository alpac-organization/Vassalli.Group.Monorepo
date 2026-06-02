import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";

export type CostCenterColumnDef = {
  key: string;
  label: string;
  render: (item: GetCostCentersResponse) => string;
};
export const costCenterColumns: CostCenterColumnDef[] = [
  {
    key: "cost_center_name",
    label: "Nombre del Centro de Costos",
    render: (item) => item.cost_center_name,
  },
  {
    key: "descripcion",
    label: "Descripción",
    render: (item) => item.descripcion,
  },
];
