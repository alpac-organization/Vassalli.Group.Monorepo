import { Badges, Button, DataTable, type TableColumn } from "@alpac/design-system";
import type { SanctionDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-sanctions.response";
import type { SanctionsTableProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-table/sanctions-table.types";
import {
  getSanctionStatusBadgeClass,
  getSanctionStatusLabel,
  getSanctionTypeLabel,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { useMemo } from "react";

const buildColumns = (
  onViewDetail: (row: SanctionDto) => void,
): TableColumn<SanctionDto>[] => [
  {
    key: "collaborator_name",
    label: "Colaborador",
    render: (row) => row.collaborator_name?.trim() || "—",
  },
  {
    key: "sanction_type",
    label: "Tipo",
    render: (row) => getSanctionTypeLabel(row.sanction_type),
  },
  {
    key: "sanction_status",
    label: "Estado",
    render: (row) => (
      <Badges
        label={getSanctionStatusLabel(row.sanction_status)}
        color="transparent"
        className={getSanctionStatusBadgeClass(row.sanction_status)}
      />
    ),
  },
  {
    key: "reason",
    label: "Motivo",
    render: (row) => (
      <span className="line-clamp-2 max-w-[18rem] text-neutral-700 dark:text-neutral-300">
        {row.reason?.trim() || "—"}
      </span>
    ),
  },
  {
    key: "suspension_start_date",
    label: "Suspensión",
    render: (row) =>
      row.suspension_start_date && row.suspension_end_date
        ? `${row.suspension_start_date} → ${row.suspension_end_date}`
        : "—",
  },
  {
    key: "created_at",
    label: "Registrada",
    render: (row) => row.created_at?.slice(0, 10) || "—",
  },
  {
    key: "actions",
    label: "Acciones",
    render: (row) => (
      <Button
        label="Ver detalle"
        size="small"
        className="bg-alpac-primary-500! text-[13px]! text-white! dark:bg-alpac-primary-700!"
        onClick={() => onViewDetail(row)}
      />
    ),
  },
];

export const SanctionsTable = ({
  data,
  pagination,
  onViewDetail,
}: SanctionsTableProps) => {
  const columns = useMemo(() => buildColumns(onViewDetail), [onViewDetail]);

  return (
    <DataTable
      title="Lista de sanciones disciplinarias"
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
};
