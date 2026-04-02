import { Badges, Button, DataTable } from "@alpac/design-system";
import type { VacationRequestRow } from "@app/modules/vacations/domain/types/vacation-request.types";
import { formatVacationDate } from "@app/modules/vacations/ui/utils/format-vacation-date";

type VacationRequestsTableProps = {
  data: VacationRequestRow[];
  onViewDetails?: (row: VacationRequestRow) => void;
};

function statusBadgeColor(status: VacationRequestRow["status"]): string {
  switch (status) {
    case "Aprobado":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "Pendiente":
      return "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200";
    case "Rechazado":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export function VacationRequestsTable({
  data,
  onViewDetails,
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
        <Badges label={row.status} color={statusBadgeColor(row.status)} />
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
      key: "actions",
      label: "Acciones",
      render: (row: VacationRequestRow) => (
        <Button
          type="button"
          size="small"
          label="Ver detalles"
          onClick={() => onViewDetails?.(row)}
          className="text-[13px]! bg-white! text-neutral-900! border! border-neutral-900! dark:bg-transparent! dark:text-white! dark:border-neutral-400!"
        />
      ),
    },
  ];

  return (
    <DataTable title="Solicitudes de vacaciones" data={data} columns={columns} />
  );
}
