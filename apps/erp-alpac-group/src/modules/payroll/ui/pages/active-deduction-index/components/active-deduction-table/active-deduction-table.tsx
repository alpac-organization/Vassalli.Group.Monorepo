import { DataTable } from "@alpac/design-system";
import { useMemo } from "react";
import { buildColumns } from "./active-deduction-table.columns";
import type { ActiveDeductionTableProps } from "./active-deduction-table.types";

export const ActiveDeductionTable = ({
  data,
  pagination,
  isLoading = false,
  onViewDetail,
}: ActiveDeductionTableProps) => {
  const columns = useMemo(() => buildColumns(onViewDetail), [onViewDetail]);

  return (
    <DataTable
      title="Lista de deducciones activas"
      data={data}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
    />
  );
};
