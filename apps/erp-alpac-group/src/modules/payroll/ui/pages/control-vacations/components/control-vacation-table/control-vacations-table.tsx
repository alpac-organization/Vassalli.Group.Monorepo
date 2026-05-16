import { DataTable, Pagination } from "@alpac/design-system";
import type { ControlVacationsTableProps } from "./types/control-vacation.table";
import type { VacationAccruals } from "@app/modules/payroll/domain/ApiContract/Responses/control-vacation-responses/get-control-vacations-response";
import {
  formatDateToSpanishWords,
  formatIdentificationNumber,
} from "@app/shared/utils/string.utils";

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
      render: (row: VacationAccruals) => (
        <span className="font-semibold text-neutral-900 dark:text-white">
          {row.collaborator_information?.collaborator_fullname ?? "—"}
        </span>
      ),
    },
    {
      key: "collaborator_code",
      label: "Código",
      render: (row: VacationAccruals) =>
        row.collaborator_information?.code ?? "—",
    },
    {
      key: "identification_number",
      label: "Identificación",
      render: (row: VacationAccruals) => {
        const id = row.collaborator_information?.identification_number;
        if (!id) return "—";
        return id.length === 14 ? formatIdentificationNumber(id) : id;
      },
    },
    {
      key: "vacation_balance",
      label: "Balance de vacaciones",
      render: (row: VacationAccruals) => {
        const bal = row.vacation_balance;
        if (bal === undefined || bal === null) return "—";
        return (
          <span className="font-semibold text-neutral-900 dark:text-white">
            {bal} {bal === 1 ? "día" : "días"}
          </span>
        );
      },
    },
    {
      key: "enjoyed_vacations",
      label: "Vacaciones gozadas",
      render: (row: VacationAccruals) => {
        const enjoyed = row.enjoyed_vacations;
        if (enjoyed === undefined || enjoyed === null) return "—";
        return (
          <span className="text-neutral-800 dark:text-neutral-200">
            {enjoyed} {enjoyed === 1 ? "día" : "días"}
          </span>
        );
      },
    },
    {
      key: "entry_date",
      label: "Fecha de ingreso",
      render: (row: VacationAccruals) => {
        const dateStr = row.collaborator_information?.entry_date;
        return formatDateToSpanishWords(dateStr);
      },
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
