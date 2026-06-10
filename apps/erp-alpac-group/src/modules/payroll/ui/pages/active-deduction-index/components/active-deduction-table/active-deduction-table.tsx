import { Badges, DataTable, type TableColumn } from "@alpac/design-system";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import { getDeductionTypeLabel } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import {
  getDeductionStatusBadgeColor,
  getDeductionStatusLabel,
} from "@app/modules/payroll/domain/enums/deduction-enums/deduction-status.enum";
import type { ActiveDeductionTableProps } from "./active-deduction-table.types";

const columns: TableColumn<DeductionDto>[] = [
  {
    key: "collaborato_fullname",
    label: "Nombre de Colaborador",
    render: (row) => row.collaborato_fullname?.trim() || "—",
  },
  {
    key: "type",
    label: "Tipo Deducción",
    render: (row) => (
      <span className="text-neutral-700 dark:text-neutral-300">
        {getDeductionTypeLabel(row.type)}
      </span>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <Badges
        label={getDeductionStatusLabel(row.status)}
        color="transparent"
        className={getDeductionStatusBadgeColor(row.status)}
      />
    ),
  },
];

export const ActiveDeductionTable =
  ({ data, pagination }: ActiveDeductionTableProps) => {
    
    return (
      <DataTable
        title="Lista de deducciones activas"
        data={data}
        columns={columns}
        pagination={pagination}
      />
    );
  };
