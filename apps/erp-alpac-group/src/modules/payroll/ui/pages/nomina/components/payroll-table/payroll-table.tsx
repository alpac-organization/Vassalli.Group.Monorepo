import { DataTable, Pagination } from "@alpac/design-system";
import type { GetCollaboratorsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborators.response";
import { formatIdentificationNumber } from "@app/shared/utils/string.utils";
import type { PayrollTableProps } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";

export function PayrollTable({
  rows,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  isPending,
}: PayrollTableProps) {
  rows;
  const columns = [
    { key: "inss", label: "Inss" },
    {
      key: "identification_number",
      label: "Identificación",
      render: (value: GetCollaboratorsResponse) => {
        if (!value.identification_number) return "—";
        if (value.identification_number.length !== 14) {
          return value.identification_number;
        }
        return formatIdentificationNumber(value.identification_number);
      },
    },
    { key: "full_name", label: "Nombre Completo" },
    { key: "branch_name", label: "Sucursal" },
    { key: "work_area", label: "Área" },
    { key: "salario bruto", label: "Salario bruto" },
    { key: "Bono", label: "Bonos" },
    { key: "vacaciones", label: "Vacaciones" },
    { key: "deducciones", label: "Deducciones" },
    { key: "total deducciones", label: "Total deducciones" },
    { key: "pago total", label: "Pago total" },

    //  {
    //    key: "actions",
    //    label: "Acciones",
    //    render: (value: GetCollaboratorsResponse) => (
    //      <Button
    //        label="Ver detalles"
    //        size="small"
    //        className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
    //        onClick={() => onViewProfile(value)}
    //      />
    //    ),
    //  },
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
