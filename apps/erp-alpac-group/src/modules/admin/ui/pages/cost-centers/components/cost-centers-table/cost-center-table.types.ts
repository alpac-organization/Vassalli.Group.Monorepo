import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";
import type { CostCenterColumnDef } from "./cost-centers.columns";

export interface CostCenterTableProps {
  data: GetCostCentersResponse[];
  onDelete: (costCenterId: string) => void;
  columns: CostCenterColumnDef[];
}
