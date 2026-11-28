import { DataTable } from "@alpac/design-system";
import { buildTerminationColumns } from "@app/modules/payroll/ui/pages/proceso-baja/components/terminations-table/terminations-table.columns";
import type { TerminationsTableProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/terminations-table/terminations-table.types";
import { useMemo } from "react";

export const TerminationsTable = ({
  data,
  pagination,
  mode,
  onViewDetail,
  onClose,
  onCancel,
  onCalculateLiquidation,
  canCalculateLiquidation,
}: TerminationsTableProps) => {
  const columns = useMemo(
    () =>
      buildTerminationColumns({
        mode,
        onViewDetail,
        onClose,
        onCancel,
        onCalculateLiquidation,
        canCalculateLiquidation,
      }),
    [
      mode,
      onViewDetail,
      onClose,
      onCancel,
      onCalculateLiquidation,
      canCalculateLiquidation,
    ],
  );

  return (
    <DataTable
      title="Registro de bajas"
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
};
