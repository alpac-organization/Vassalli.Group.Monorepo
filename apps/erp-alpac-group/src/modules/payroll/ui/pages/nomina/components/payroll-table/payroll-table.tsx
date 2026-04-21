import { DataTable, Pagination } from "@alpac/design-system";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-payroll";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import type { PayrollTableProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";
import { formatCurrency } from "@app/shared/utils/currency.utils";
export function PayrollTable({
  rows,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  isPending,
}: PayrollTableProps) {
  const columns = [
    {
      key: "collaborator_code",
      label: "Código",
      render: (item: PayrollItemResponse) =>
        item.collaborator?.collaborator_code ?? "—",
    },
    {
      key: "full_name",
      label: "Nombre Completo",
      render: (item: PayrollItemResponse) =>
        item.collaborator?.full_name ?? "—",
    },
    {
      key: "identification_number",
      label: "Identificación",
      render: (item: PayrollItemResponse) => {
        const idNumber = item.collaborator?.identification_number;
        console.log(idNumber);
        if (!idNumber) return "—";
        if (idNumber.length !== 14) return idNumber;
        return formatIdentificationNumber(idNumber);
      },
    },
    {
      key: "branch_name",
      label: "Area de Trabajo",
    },
    {
      key: "gross_salary",
      label: "Salario Ordinario",
      render: (item: PayrollItemResponse) =>
        formatCurrency(item.gross_salary ?? 0, "NIO") ?? "—",
    },
    {
      key: "ir",
      label: "IR",
      render: (item: PayrollItemResponse) =>
        formatCurrency(item.ir ?? 0, "NIO") ?? "—",
    },
    {
      key: "inss",
      label: "INSS",
      render: (item: PayrollItemResponse) =>
        formatCurrency(item.inss ?? 0, "NIO") ?? "—",
    },
    {
      key: "vacations",
      label: "Vacaciones",
    },
    {
      key: "bonos",
      label: "Bonos",
    },
    {
      key: "deductions",
      label: "Deducciones",
      render: (item: PayrollItemResponse) => item.deductions ?? "—",
    },
    {
      key: "total_deductions",
      label: "Total de Deducciones",
    },
    {
      key: "total_to_pay",
      label: "Pago total",
      render: (item: PayrollItemResponse) =>
        formatCurrency(item.total_to_pay ?? 0, "NIO") ?? "—",
    },
  ];

  return (
    <DataTable
      title="Listado de Nomina"
      data={rows}
      columns={columns}
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
