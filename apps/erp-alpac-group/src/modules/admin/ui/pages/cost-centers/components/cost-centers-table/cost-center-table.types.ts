import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";
import type { CostCenterColumnDef } from "./cost-centers.columns";
import type { ReactNode } from "react";

export interface CostCenterTableProps {
  data: GetCostCentersResponse[];
  onDeleteClick: (costCenter: GetCostCentersResponse) => void;
  deleteIcon?: ReactNode;
  columns: CostCenterColumnDef[];
  pagination?: ReactNode;
  isLoading?: boolean;
}
