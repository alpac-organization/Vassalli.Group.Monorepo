import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import type { AreaColumnDef } from "./area-columns";
import type { ReactNode } from "react";

export interface AreaTableProps {
  data: GetAreasResponse[];
  onDeleteClick: (area: GetAreasResponse) => void;
  columns: AreaColumnDef[];
  pagination?: ReactNode;
  isLoading?: boolean;
}
