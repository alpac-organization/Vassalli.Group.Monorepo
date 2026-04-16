import { Button, DataTable, Pagination } from "@alpac/design-system";
import type { ControlVacationsTableProps } from "@app/modules/payroll/ui/pages/control-vacations/components/control-vacation-table/type/control-vacation.table";
import type { VacationControlItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-control-vacations-response";
import { PermitTypeBadge } from "@app/modules/payroll/ui/pages/control-vacations/utils/vacations.mapper";

export function ControlVacationsTable({
  rows,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  isPending,
  onViewDetails,
}: ControlVacationsTableProps) {
  const columns = [
    {
      key: "collaborator_fullname",
      label: "Nombre completo",
      render: (row: VacationControlItemResponse) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {row.collaborator_fullname ?? "—"}
        </span>
      ),
    },
    {
      key: "collaborator_code",
      label: "Código",
      render: (row: VacationControlItemResponse) => row.collaborator_code ?? "—",
    },
    {
      key: "amount_days",
      label: "Días",
      render: (row: VacationControlItemResponse) => row.amount_days,
    },
    {
      key: "permit_application_type",
      label: "Tipo",
      render: (row: VacationControlItemResponse) => (
        <PermitTypeBadge type={row.permit_application_type} />
      ),
    },
    {
      key: "work_position",
      label: "Puesto",
      render: (row: VacationControlItemResponse) => row.work_position ?? "—",
    },
    {
      key: "description",
      label: "Descripción",
      render: (row: VacationControlItemResponse) => {
        const text = row.description?.trim() ?? "";
        if (!text) {
          return "—";
        }
        return (
          <span className="text-neutral-800 dark:text-neutral-200">
            {text}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Acciones",
      render: (row: VacationControlItemResponse) => (
        <div className="flex">
          <Button
            type="button"
            size="small"
            label="Ver detalles"
            onClick={() => onViewDetails(row)}
            className="text-[13px]! bg-white! text-neutral-900! border! border-neutral-900! dark:bg-transparent! dark:text-white! dark:border-neutral-400! hover:scale-[1.03] transition-transform duration-150"
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Historial de vacaciones"
      data={rows}
      columns={columns}
      rowClassName=""
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
