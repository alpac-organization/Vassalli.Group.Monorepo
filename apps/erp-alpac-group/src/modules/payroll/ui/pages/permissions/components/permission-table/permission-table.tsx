import { Badges, Button, DataTable } from "@alpac/design-system";
import { getPermissionStatusUiLabel } from "@app/modules/payroll/ui/pages/permissions/constants/vacation-status.constants";
import { PERMISSION_TYPE_LABEL } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { formatVacationDate } from "@app/modules/payroll/ui/pages/permissions/utils/format-vacation-date";
import type { PermissionTableProps } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/types/permission-table.type";
import type { PermissionHistoryRow } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/permission-history-request";
import { statusBadgeColor } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/utils/statusBadgeColor";

export function PermissionTable({
  data,
  onViewDetails,
  onCancelRequest,
}: PermissionTableProps) {
  const columns = [
    {
      key: "full_name",
      label: "Nombre completo",
      render: (row: PermissionHistoryRow) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {row.full_name}
        </span>
      ),
    },
    {
      key: "type",
      label: "Tipo",
      render: (row: PermissionHistoryRow) => (
        <span className="text-neutral-700 dark:text-neutral-300">
          {PERMISSION_TYPE_LABEL[row.type] ?? row.type}
        </span>
      ),
    },
    {
      key: "start_date",
      label: "Fecha inicio",
      render: (row: PermissionHistoryRow) => formatVacationDate(row.start_date),
    },
    {
      key: "end_date",
      label: "Fecha fin",
      render: (row: PermissionHistoryRow) => formatVacationDate(row.end_date),
    },
    {
      key: "start_time",
      label: "Hora inicio",
      render: (row: PermissionHistoryRow) =>
        row.type === "Vacation" ? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ) : (
          <span>{row.start_time ?? "—"}</span>
        ),
    },
    {
      key: "end_time",
      label: "Hora fin",
      render: (row: PermissionHistoryRow) =>
        row.type === "Vacation" ? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ) : (
          <span>{row.end_time ?? "—"}</span>
        ),
    },
    {
      key: "status",
      label: "Estado",
      render: (row: PermissionHistoryRow) => (
        <Badges
          label={getPermissionStatusUiLabel(row.status)}
          color={statusBadgeColor(row.status)}
        />
      ),
    },
    {
      key: "approved_by",
      label: "Aprobado por",
      render: (row: PermissionHistoryRow) =>
        row.approved_by ?? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ),
    },
    {
      key: "rejected_by",
      label: "Rechazado por",
      render: (row: PermissionHistoryRow) =>
        row.rejected_by ?? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: PermissionHistoryRow) => {
        const canCancel = row.status === "Pending";
        //   const canGenerateDocument = row.status === "Pending";
        return (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="small"
              label="Ver detalles"
              onClick={() => onViewDetails?.(row)}
              className="text-[13px]! bg-white! text-neutral-900! border! border-neutral-900! dark:bg-transparent! dark:text-white! dark:border-neutral-400! hover:scale-[1.03] transition-transform duration-150"
            />
            {canCancel && (
              <Button
                type="button"
                size="small"
                label="Cancelar solicitud"
                disabled={!canCancel}
                onClick={() => onCancelRequest?.(row)}
                className="text-[13px]! bg-white! text-alpac-primary-600! border! border-alpac-primary-500! dark:bg-transparent! dark:text-alpac-primary-400! dark:border-alpac-primary-500! hover:scale-[1.03] transition-transform duration-150 disabled:opacity-50 disabled:pointer-events-none"
              />
            )}
            {/* {canGenerateDocument && (
              <Button
                type="button"
                size="small"
                label="Generar documento"
                disabled={!canGenerateDocument}
                onClick={() => onGenerateDocument?.(row)}
                className="text-[13px]! bg-white! text-alpac-primary-600! border! border-alpac-primary-500! dark:bg-transparent! dark:text-alpac-primary-400! dark:border-alpac-primary-500! hover:scale-[1.03] transition-transform duration-150 disabled:opacity-50 disabled:pointer-events-none"
              />
            )} */}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      title="Solicitudes de permisos"
      data={data}
      columns={columns}
      rowClassName=""
    />
  );
}
