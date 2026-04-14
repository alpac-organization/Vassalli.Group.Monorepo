import {Button, DataTable, Pagination } from "@alpac/design-system";
import { formatVacationDate } from "@app/modules/vacations/ui/pages/vacation-index/utils/format-vacation-date";
import type { ControlVacationsTableProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/type/control-vacation.table";
import type { GetVacationsHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";

export function ControlVacationsTable({
  data,
  onPageChange,
  isPending,
  onViewDetails,
}: ControlVacationsTableProps) {
  const columns = [
    {
      key: "full_name",
      label: "Nombre completo",
      render: (row: GetVacationsHistoryResponse) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {row.full_name}
        </span>
      ),
    },
    {
      key: "start_date",
      label: "Fecha inicio",
      render: (row: GetVacationsHistoryResponse) =>
        formatVacationDate(row.start_date),
    },
    {
      key: "end_date",
      label: "Fecha fin",
      render: (row: GetVacationsHistoryResponse) =>
        formatVacationDate(row.end_date),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: GetVacationsHistoryResponse) => {
        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="small"
              label="Ver detalles"
              onClick={() => onViewDetails?.(row)}
              className="text-[13px]! bg-white! text-neutral-900! border! border-neutral-900! dark:bg-transparent! dark:text-white! dark:border-neutral-400! hover:scale-[1.03] transition-transform duration-150"
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      title="Historial de vacaciones"
      data={data.data}
      columns={columns}
      pagination={
        <Pagination
          currentPage={data.page_number}
          pageSize={data.page_size}
          totalRecords={data.total_records}
          onPageChange={onPageChange}
          disabled={isPending}
        />
      }
    />
  );
}
