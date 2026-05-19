import { useMemo } from "react";
import {
  DataTable,
  Pagination,
  DataTableColumnVisibility,
} from "@alpac/design-system";
import type { PayrollTableProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";

const ClickableDataTable = DataTable as any;
export function PayrollTable({
  rows,
  columns,
  currentPage,
  pageSize,
  totalRecords,
  visibleKeys,
  onVisibleKeysChange,
  onPageChange,
  onRowDoubleClick,
  isPending,
}: PayrollTableProps) {
  const activeColumns = useMemo(
    () => columns.filter((col) => visibleKeys.includes(col.key as string)),
    [columns, visibleKeys],
  );

  return (
    <ClickableDataTable
      title="Listado de Nomina"
      data={rows}
      columns={activeColumns}
      onRowDoubleClick={onRowDoubleClick}
      toolbarEnd={
        <DataTableColumnVisibility
          options={columns.map((c) => ({
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
