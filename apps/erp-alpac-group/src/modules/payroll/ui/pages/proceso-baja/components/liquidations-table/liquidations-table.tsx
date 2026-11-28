import { DataTable } from "@alpac/design-system";
import { buildLiquidationColumns } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidations-table/liquidations-table.columns";
import type { LiquidationsTableProps } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidations-table/liquidations-table.types";
import { useMemo } from "react";

export const LiquidationsTable = ({
  data,
  pagination,
  mode,
  onViewDetail,
  onApprove,
  onPay,
  onCancel,
}: LiquidationsTableProps) => {
  const columns = useMemo(
    () =>
      buildLiquidationColumns({
        mode,
        onViewDetail,
        onApprove,
        onPay,
        onCancel,
      }),
    [mode, onViewDetail, onApprove, onPay, onCancel],
  );

  return (
    <DataTable
      title="Registro de liquidaciones"
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
};
