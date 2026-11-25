import { DataTable } from "@alpac/design-system";
import { useMemo } from "react";
import { buildColumns } from "./personnel-actions-table.columns";
import type { PersonnelActionsTableProps } from "./personnel-actions-table.types";

export const PersonnelActionsTable = ({
  data,
  pagination,
  isLoading = false,
  canReview = false,
  canApply = false,
  onViewDetail,
  onReview,
  onApply,
}: PersonnelActionsTableProps) => {
  const columns = useMemo(
    () =>
      buildColumns({
        onViewDetail,
        onReview,
        onApply,
        canReview,
        canApply,
      }),
    [onViewDetail, onReview, onApply, canReview, canApply],
  );

  return (
    <DataTable
      title="Registro de Solicitudes de Acción de Personal"
      data={data}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
    />
  );
};
