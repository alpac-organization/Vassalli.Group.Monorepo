import { Badges, Button, DataTable } from "@alpac/design-system";
import type { VacationRequestRow } from "@app/modules/vacations/domain/ApiContract/Requests/vacation-history-request";
import { getVacationStatusUiLabel } from "@app/modules/vacations/ui/pages/vacation-index/constants/vacation-status.constants";
import { formatVacationDate } from "@app/modules/vacations/ui/pages/vacation-index/utils/format-vacation-date";

type VacationRequestsTableProps = {
  data: VacationRequestRow[];
  onViewDetails?: (row: VacationRequestRow) => void;
  onGenerateDocument?: (row: VacationRequestRow) => void;
  onCancelRequest?: (row: VacationRequestRow) => void;
};

function statusBadgeColor(status: VacationRequestRow["status"]): string {
  switch (status) {
    case "Approved":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "Pending":
      return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
    case "Rejected":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200";
    case "Cancelled":
      return "bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function VacationRequestsTable({
  data,
  onViewDetails,
  onGenerateDocument,
  onCancelRequest,
}: VacationRequestsTableProps) {
  const columns = [
    {
      key: "full_name",
      label: "Nombre completo",
      render: (row: VacationRequestRow) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {row.full_name}
        </span>
      ),
    },
    {
      key: "start_date",
      label: "Fecha inicio",
      render: (row: VacationRequestRow) => formatVacationDate(row.start_date),
    },
    {
      key: "end_date",
      label: "Fecha fin",
      render: (row: VacationRequestRow) => formatVacationDate(row.end_date),
    },
    {
      key: "status",
      label: "Estado",
      render: (row: VacationRequestRow) => (
        <Badges
          label={getVacationStatusUiLabel(row.status)}
          color={statusBadgeColor(row.status)}
        />
      ),
    },
    {
      key: "approved_by",
      label: "Aprobado por",
      render: (row: VacationRequestRow) =>
        row.approved_by ?? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ),
    },
    {
      key: "rejected_by",
      label: "Rechazado por",
      render: (row: VacationRequestRow) =>
        row.rejected_by ?? (
          <span className="text-neutral-400 dark:text-neutral-500">—</span>
        ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: VacationRequestRow) => {
        const canCancel = row.status === "Pending";
        const canGenerateDocument = row.status === "Approved";
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
      title="Solicitudes de permisos"
      data={data}
      columns={columns}
      rowClassName=""
    />
  );
}
