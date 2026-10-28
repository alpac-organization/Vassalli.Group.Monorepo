import { Badges, Button, DataTable, type TableColumn } from "@alpac/design-system";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import type { FaultsTableProps } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-table/faults-table.types";
import {
  getFaultSeverityLabel,
  getFaultSourceLabel,
  getFaultStatusBadgeClass,
  getFaultStatusLabel,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { useMemo } from "react";

const buildColumns = (
  onViewDetail: (row: FaultDto) => void,
): TableColumn<FaultDto>[] => [
  {
    key: "collaborator_name",
    label: "Colaborador",
    render: (row) => row.collaborator_name?.trim() || "—",
  },
  {
    key: "fault_catalog",
    label: "Falta",
    render: (row) => (
      <span className="text-neutral-700 dark:text-neutral-300">
        {row.fault_catalog?.code
          ? `${row.fault_catalog.code} — ${row.fault_catalog.name}`
          : "—"}
      </span>
    ),
  },
  {
    key: "occurrence_date",
    label: "Fecha",
    render: (row) => row.occurrence_date || "—",
  },
  {
    key: "severity",
    label: "Severidad",
    render: (row) => getFaultSeverityLabel(row.severity),
  },
  {
    key: "source",
    label: "Origen",
    render: (row) => getFaultSourceLabel(row.source),
  },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <Badges
        label={getFaultStatusLabel(row.status)}
        color="transparent"
        className={getFaultStatusBadgeClass(row.status)}
      />
    ),
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

export const FaultsTable = ({
  data,
  pagination,
  onViewDetail,
}: FaultsTableProps) => {
  const columns = useMemo(() => buildColumns(onViewDetail), [onViewDetail]);

  return (
    <DataTable
      title="Lista de faltas disciplinarias"
      data={data}
      columns={columns}
      pagination={pagination}
    />
  );
};
