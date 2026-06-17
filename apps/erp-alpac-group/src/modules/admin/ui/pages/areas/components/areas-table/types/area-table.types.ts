import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import type { AreaColumnDef } from "@app/modules/admin/ui/pages/areas/components/areas-table/utils/area-columns";
import type { ReactNode } from "react";
export interface AreaTableProps {
  data: GetAreasResponse[];
  onDeleteClick: (area: GetAreasResponse) => void;
  deleteIcon?: ReactNode;
  columns: AreaColumnDef[];
  pagination?: ReactNode;
  isLoading?: boolean;
}
