import { DataTable, type TableColumn } from "@alpac/design-system";
import type { GetSubsidyHistoryResponse } from "@app/modules/payroll/domain/ApiContract/Responses/subsidy-responses/get-subsidy-history.response";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatDate } from "@app/shared/utils/string.utils";
import type { SubsidyHistoryTableProps } from "./subsidy-history-table.types";

const columns: TableColumn<GetSubsidyHistoryResponse>[] = [
   {
      key: "collaborator_code",
      label: "Código",
      render: (row) => row.collaborator_code?.trim() || "—",
   },
   {
      key: "collaborator_full_name",
      label: "Colaborador",
      render: (row) => row.collaborator_full_name?.trim() || "—",
   },
   {
      key: "type_subsidy_name",
      label: "Tipo de Subsidio",
      render: (row) => row.type_subsidy_name?.trim() || "—",
   },
   {
      key: "reference_number",
      label: "Número de Referencia",
      render: (row) => row.reference_number?.trim() || "—",
   },
   {
      key: "start_date",
      label: "Fecha Inicio",
      render: (row) => formatDate(row.start_date) || "—",
   },
   {
      key: "end_date",
      label: "Fecha Fin",
      render: (row) => formatDate(row.end_date) || "—",
   },
   {
      key: "amount_days",
      label: "Días",
      render: (row) => row.amount_days ?? "—",
   },
   {
      key: "percentage",
      label: "Porcentaje",
      render: (row) =>
         row.percentage != null ? `${row.percentage}%` : "—",
   },
   {
      key: "company_assumed_amount",
      label: "Monto Empresa",
      render: (row) =>
         formatCurrency(row.company_assumed_amount ?? 0, "NIO") ?? "—",
   },
   {
      key: "inss_reimbursement_amount",
      label: "Reembolso INSS",
      render: (row) =>
         formatCurrency(row.inss_reimbursement_amount ?? 0, "NIO") ?? "—",
   },
];

export const SubsidyHistoryTable = ({
   data,
   pagination,
}: SubsidyHistoryTableProps) => {
   return (
      <DataTable
         title="Subsidios"
         data={data}
         columns={columns}
         pagination={pagination}
      />
   );
};
