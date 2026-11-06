import {
  Badges,
  ContextMenu,
  DataTable,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import { getPermissionStatusUiLabel } from "@app/modules/payroll/ui/pages/permissions/constants/vacation-status.constants";
import { PERMISSION_TYPE_LABEL } from "@app/modules/payroll/ui/pages/permissions/constants/permission-filters.constants";
import { formatDate } from "@app/shared/utils/string.utils";
import type { PermissionTableProps } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/types/permission-table.type";
import type { PermissionResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import { statusBadgeColor } from "@app/modules/payroll/ui/pages/permissions/components/permission-table/utils/statusBadgeColor";
import { formatTimeOrDash } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-details/utils/validate.details-content";

const contextMenuButton =
  "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export function PermissionTable({
  data,
  pagination,
  onViewDetails,
  onCancelRequest,
}: PermissionTableProps) {
  const columns = [
    {
      key: "full_name",
      label: "Nombre completo",
      render: (row: PermissionResponse) => row.requested_by ?? "—",
    },
    {
      key: "type",
      label: "Tipo",
      render: (row: PermissionResponse) => (
        <span className="text-neutral-700 dark:text-neutral-300">
          {PERMISSION_TYPE_LABEL[row.type] ?? row.type}
        </span>
      ),
    },
    {
      key: "amount_days",
      label: "Cantidad de días",
      render: (row: PermissionResponse) => {
        if (row.start_time && row.end_time) {
          return "—";
        }
        return row.amount_days;
      },
    },
    {
      key: "description",
      label: "Descripción",
      render: (row: PermissionResponse) => row.description ?? "—",
    },
    {
      key: "start_date",
      label: "Fecha inicio",
      render: (row: PermissionResponse) => formatDate(row.start_date),
    },
    {
      key: "end_date",
      label: "Fecha fin",
      render: (row: PermissionResponse) => formatDate(row.end_date),
    },
    {
      key: "start_time",
      label: "Hora inicio",
      render: (row: PermissionResponse) => (
        <span>{formatTimeOrDash(row.start_time)}</span>
      ),
    },
    {
      key: "end_time",
      label: "Hora fin",
      render: (row: PermissionResponse) => (
        <span>{formatTimeOrDash(row.end_time)}</span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (row: PermissionResponse) => (
        <Badges
          label={getPermissionStatusUiLabel(row.status)}
          color={statusBadgeColor(row.status)}
        />
      ),
    },
    {
      key: "first_step_status_reviewed_by",
      label: "Aprobado por primer paso",
      render: (row: PermissionResponse) =>
        row.first_step_status.reviewed_by ?? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ),
    },
    {
      key: "second_step_status_reviewed_by",
      label: "Aprobado por segundo paso",
      render: (row: PermissionResponse) =>
        row.second_step_status.reviewed_by ?? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: PermissionResponse) => {
        const items: ContextMenuItem[] = [
          {
            label: "Ver detalles",
            onClick: () => onViewDetails?.(row),
          },
        ];

        if (row.status === "Pending") {
          items.push({
            label: "Cancelar solicitud",
            onClick: () => onCancelRequest?.(row),
          });
        }

        return (
          <ContextMenu items={items} triggerClassName={contextMenuButton} />
        );
      },
    },
  ];

  return (
    <DataTable
      title="Solicitudes de permisos"
      data={data}
      columns={columns as TableColumn<PermissionResponse>[]}
      rowClassName=""
      pagination={pagination}
    />
  );
}
