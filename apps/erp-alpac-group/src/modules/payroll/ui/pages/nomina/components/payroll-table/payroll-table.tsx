import { useMemo } from "react";
import {
  DataTable,
  Pagination,
  DataTableColumnVisibility,
} from "@alpac/design-system";
import type { PayrollTableProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";
import { payrollColumns } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/payroll-columns";

const ClickableDataTable = DataTable as any;
export function PayrollTable({
  rows,
  currentPage,
  pageSize,
  totalRecords,
  visibleKeys,
  onVisibleKeysChange,
  onPageChange,
  onRowClick,
  isPending,
}: PayrollTableProps) {
  const activeColumns = useMemo(
    () =>
      payrollColumns.filter((col) => visibleKeys.includes(col.key as string)),
    [visibleKeys],
  );

  return (
    <ClickableDataTable
      title="Listado de Nomina"
      data={rows}
      columns={activeColumns}
      onRowClick={onRowClick}
      toolbarEnd={
        <DataTableColumnVisibility
          options={payrollColumns.map((c) => ({
            value: c.key as string,
            label: c.label,
          }))}
          selectedValues={visibleKeys}
          onChange={onVisibleKeysChange}
        />
      }
      pagination={
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          disabled={isPending}
        />
      }
    />
  );
}
