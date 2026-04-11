import { Badges, Button, DataTable, Pagination } from "@alpac/design-system";
import { getPermissionStatusUiLabel } from "@app/modules/vacations/ui/pages/vacation-index/constants/vacation-status.constants";
import { formatVacationDate } from "@app/modules/vacations/ui/pages/vacation-index/utils/format-vacation-date";
import { statusBadgeColor } from "@app/modules/vacations/ui/pages/vacation-index/components/permission-table/utils/statusBadgeColor";
import type { ControlVacationsTableProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/type/control-vacation.table";
import type { ControlVacationHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/vacation-request";
export function ControlVacationsTable({
  data,
  onViewDetails,
  onGenerateDocument,
}: ControlVacationsTableProps) {
  const columns = [
    {
      key: "full_name",
      label: "Nombre completo",
      render: (row: ControlVacationHistoryRow) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {row.full_name}
        </span>
      ),
    },
    {
      key: "start_date",
      label: "Fecha inicio",
      render: (row: ControlVacationHistoryRow) =>
        formatVacationDate(row.start_date),
    },
    {
      key: "end_date",
      label: "Fecha fin",
      render: (row: ControlVacationHistoryRow) =>
        formatVacationDate(row.end_date),
    },
    {
      key: "status",
      label: "Estado",
      render: (row: ControlVacationHistoryRow) => (
        <Badges
          label={getPermissionStatusUiLabel(row.status)}
          color={statusBadgeColor(row.status)}
        />
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: ControlVacationHistoryRow) => {
        const canGenerateDocument = row.status === "Pending";
        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="small"
              label="Ver detalles"
              onClick={() => onViewDetails?.(row)}
              className="text-[13px]! bg-white! text-neutral-900! border! border-neutral-900! dark:bg-transparent! dark:text-white! dark:border-neutral-400! hover:scale-[1.03] transition-transform duration-150"
            />
            {canGenerateDocument && (
              <Button
                type="button"
                size="small"
                label="Generar documento"
                disabled={!canGenerateDocument}
                onClick={() => onGenerateDocument?.(row)}
                className="text-[13px]! bg-white! text-alpac-primary-600! border! border-alpac-primary-500! dark:bg-transparent! dark:text-alpac-primary-400! dark:border-alpac-primary-500! hover:scale-[1.03] transition-transform duration-150 disabled:opacity-50 disabled:pointer-events-none"
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      title="Solicitudes de vacaciones"
      data={data}
      columns={columns}
      pagination={
        <Pagination
          currentPage={data.page_number}
          pageSize={data.page_size}
          totalRecords={collaborators.total_records}
          onPageChange={handlePageChange}
          disabled={GetCollaboratorsQuery.isPending}
        />
      }
    />
  );
}
